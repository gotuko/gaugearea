package com.gaugearea.app.data

import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.sqrt

data class SwgEntry(
    val swg: Int,
    val diameterMm: Double,
    val areaMm2: Double,
    val resistancePerMeterOhm: Double,
    val weightKgPerKm: Double,
    val ratedCurrentAmps: Double,
    val approxAwg: Int
)

data class CombinationItem(
    val swg: Int,
    val count: Int,
    val singleArea: Double,
    val subtotalArea: Double
)

data class CombinationResult(
    val id: String,
    val totalWires: Int,
    val items: List<CombinationItem>,
    val totalAreaMm2: Double,
    val diffAreaMm2: Double,
    val diffPct: Double,
    val absDiffPct: Double,
    val exactMatch: Boolean,
    val score: Double,
    val isSingleGaugeParallel: Boolean
)

object SwgData {
    val SWG_TABLE: List<SwgEntry> = listOf(
        SwgEntry(10, 3.251, 8.301, 0.002077, 73.79, 41.51, 8),
        SwgEntry(11, 2.946, 6.817, 0.002529, 60.60, 34.09, 9),
        SwgEntry(12, 2.642, 5.482, 0.003145, 48.73, 27.41, 10),
        SwgEntry(13, 2.337, 4.290, 0.004019, 38.14, 21.45, 11),
        SwgEntry(14, 2.032, 3.243, 0.005316, 28.83, 16.22, 12),
        SwgEntry(15, 1.829, 2.627, 0.006563, 23.35, 13.14, 13),
        SwgEntry(16, 1.626, 2.076, 0.008305, 18.46, 10.38, 14),
        SwgEntry(17, 1.422, 1.589, 0.01085, 14.13, 7.95, 15),
        SwgEntry(18, 1.219, 1.167, 0.01477, 10.37, 5.84, 16),
        SwgEntry(19, 1.016, 0.811, 0.02126, 7.21, 4.06, 18),
        SwgEntry(20, 0.914, 0.656, 0.02628, 5.83, 3.28, 19),
        SwgEntry(21, 0.813, 0.519, 0.03322, 4.61, 2.60, 20),
        SwgEntry(22, 0.711, 0.397, 0.04343, 3.53, 1.99, 21),
        SwgEntry(23, 0.610, 0.292, 0.05904, 2.60, 1.46, 22),
        SwgEntry(24, 0.559, 0.245, 0.07037, 2.18, 1.23, 23),
        SwgEntry(25, 0.508, 0.203, 0.08493, 1.80, 1.02, 24),
        SwgEntry(26, 0.457, 0.164, 0.1051, 1.46, 0.82, 25),
        SwgEntry(27, 0.417, 0.136, 0.1268, 1.21, 0.68, 26),
        SwgEntry(28, 0.376, 0.111, 0.1553, 0.99, 0.56, 27),
        SwgEntry(29, 0.345, 0.0935, 0.1844, 0.831, 0.47, 28),
        SwgEntry(30, 0.315, 0.0779, 0.2213, 0.693, 0.39, 29),
        SwgEntry(31, 0.295, 0.0683, 0.2524, 0.607, 0.34, 30),
        SwgEntry(32, 0.274, 0.0590, 0.2922, 0.525, 0.30, 31),
        SwgEntry(33, 0.254, 0.0507, 0.3401, 0.451, 0.25, 32),
        SwgEntry(34, 0.234, 0.0430, 0.4009, 0.382, 0.22, 33),
        SwgEntry(35, 0.213, 0.0356, 0.4843, 0.316, 0.18, 34),
        SwgEntry(36, 0.193, 0.0293, 0.5884, 0.260, 0.15, 35)
    )

    val SWG_MAP: Map<Int, SwgEntry> = SWG_TABLE.associateBy { it.swg }

    val DEFAULT_STOCK_SWGS: Set<Int> = SWG_TABLE.filter { it.swg in 16..30 }.map { it.swg }.toSet()

    fun calcAreaFromDiameter(diameterMm: Double): Double {
        if (diameterMm <= 0.0) return 0.0
        return (PI * diameterMm * diameterMm) / 4.0
    }

    fun calcCombinations(
        targetArea: Double,
        wireCountChoice: Int?, // null means auto (2..6)
        tolerancePct: Double,
        availableSwgs: Set<Int>,
        allowMultipleSameWire: Boolean = true,
        maxCombinations: Int = 100
    ): List<CombinationResult> {
        if (targetArea <= 0.0) return emptyList()

        val minAllowedArea = targetArea * (1.0 - tolerancePct / 100.0)
        val maxAllowedArea = targetArea * (1.0 + tolerancePct / 100.0)

        val candidateSwgs = SWG_TABLE
            .filter { availableSwgs.contains(it.swg) }
            .sortedBy { it.swg } // Larger wire (lower SWG) first

        if (candidateSwgs.isEmpty()) return emptyList()

        val results = mutableListOf<CombinationResult>()
        val targetCounts = if (wireCountChoice != null) listOf(wireCountChoice) else (2..6).toList()

        for (wireCount in targetCounts) {
            val currentWires = mutableListOf<SwgEntry>()

            fun search(startIndex: Int) {
                if (currentWires.size == wireCount) {
                    val totalArea = currentWires.sumOf { it.areaMm2 }
                    if (totalArea in minAllowedArea..maxAllowedArea) {
                        val diffArea = totalArea - targetArea
                        val diffPct = (diffArea / targetArea) * 100.0
                        val absDiffPct = abs(diffPct)
                        val exactMatch = absDiffPct < 0.25

                        val itemsGrouped = currentWires.groupingBy { it.swg }.eachCount()
                        val items = itemsGrouped.map { (swg, count) ->
                            val entry = SWG_MAP[swg]!!
                            CombinationItem(
                                swg = swg,
                                count = count,
                                singleArea = entry.areaMm2,
                                subtotalArea = entry.areaMm2 * count
                            )
                        }.sortedBy { it.swg }

                        val isSingleGauge = items.size == 1
                        val gaugeSpan = currentWires.maxOf { it.swg } - currentWires.minOf { it.swg }

                        // Score for winding ease: lower difference is best, closer gauges are easier to wind
                        val score = absDiffPct * 2.0 + gaugeSpan * 0.5 + (if (isSingleGauge) -1.0 else 0.0)

                        val id = items.joinToString("-") { "${it.count}x${it.swg}" }
                        results.add(
                            CombinationResult(
                                id = id,
                                totalWires = wireCount,
                                items = items,
                                totalAreaMm2 = totalArea,
                                diffAreaMm2 = diffArea,
                                diffPct = diffPct,
                                absDiffPct = absDiffPct,
                                exactMatch = exactMatch,
                                score = score,
                                isSingleGaugeParallel = isSingleGauge
                            )
                        )
                    }
                    return
                }

                for (i in startIndex until candidateSwgs.size) {
                    val entry = candidateSwgs[i]
                    // Prune if current + minimum possible wires exceeds maxAllowedArea
                    if (currentWires.sumOf { it.areaMm2 } + entry.areaMm2 > maxAllowedArea * 1.05) {
                        continue
                    }

                    currentWires.add(entry)
                    val nextStart = if (allowMultipleSameWire) i else i + 1
                    search(nextStart)
                    currentWires.removeAt(currentWires.size - 1)
                }
            }

            search(0)
        }

        // Deduplicate and sort by accuracy (lowest absolute difference)
        return results
            .distinctBy { it.id }
            .sortedWith(compareBy<CombinationResult> { it.absDiffPct }.thenBy { it.score })
            .take(maxCombinations)
    }
}
