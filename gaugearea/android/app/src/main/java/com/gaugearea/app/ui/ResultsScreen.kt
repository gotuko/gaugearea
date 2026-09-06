package com.gaugearea.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gaugearea.app.data.CombinationResult
import kotlin.math.abs

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ResultsScreen(
    targetArea: Double,
    results: List<CombinationResult>,
    onBack: () -> Unit
) {
    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Calculation Results",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                        Text(
                            text = "${results.size} Valid Parallel Combinations",
                            fontSize = 12.sp,
                            color = Color.LightGray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(imageVector = Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        }
    ) { paddingValues ->
        if (results.isEmpty()) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                Text(
                    text = "No combinations found within selected tolerance.\nTry increasing the tolerance percentage.",
                    color = Color.Gray,
                    textAlign = androidx.compose.ui.text.style.TextAlign.Center
                )
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues)
                    .padding(horizontal = 16.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
                contentPadding = PaddingValues(vertical = 16.dp)
            ) {
                // Target Area Reminder
                item {
                    Card(
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = CardDefaults.cardColors(
                            containerColor = MaterialTheme.colorScheme.surfaceVariant
                        )
                    ) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(12.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("Target Area", fontSize = 12.sp, color = Color.Gray)
                            Text(
                                String.format("%.4f mm²", targetArea),
                                fontSize = 14.sp,
                                fontWeight = FontWeight.Bold,
                                fontFamily = FontFamily.Monospace,
                                color = Color.White
                            )
                        }
                    }
                }

                // Combination Cards
                items(results, key = { it.id }) { result ->
                    CombinationCard(result = result, targetArea = targetArea)
                }
            }
        }
    }
}

@Composable
fun CombinationCard(result: CombinationResult, targetArea: Double) {
    val diffColor = when {
        result.absDiffPct <= 1.0 -> Color(0xFF10B981) // Emerald
        result.diffPct > 0 -> Color(0xFF38BDF8) // Light blue
        else -> Color(0xFFF59E0B) // Amber
    }

    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(14.dp),
        colors = CardDefaults.cardColors(
            containerColor = MaterialTheme.colorScheme.surface
        )
    ) {
        Column(modifier = Modifier.padding(14.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Wire badges (e.g. 2x SWG 21)
                Row(
                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    result.items.forEach { item ->
                        Box(
                            modifier = Modifier
                                .clip(RoundedCornerShape(6.dp))
                                .background(MaterialTheme.colorScheme.surfaceVariant)
                                .padding(horizontal = 8.dp, vertical = 4.dp)
                        ) {
                            Text(
                                text = "${item.count}× SWG ${item.swg}",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }
                }

                // Exact match badge or difference
                val diffSign = if (result.diffPct >= 0) "+" else ""
                Text(
                    text = String.format("%s%.2f%%", diffSign, result.diffPct),
                    fontSize = 12.sp,
                    fontWeight = FontWeight.Black,
                    color = diffColor
                )
            }

            Spacer(modifier = Modifier.height(10.dp))

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text("Total Calculated Area", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        String.format("%.4f mm²", result.totalAreaMm2),
                        fontSize = 15.sp,
                        fontWeight = FontWeight.Bold,
                        fontFamily = FontFamily.Monospace,
                        color = Color.White
                    )
                }

                Column(horizontalAlignment = Alignment.End) {
                    Text("Total Wires", fontSize = 11.sp, color = Color.Gray)
                    Text(
                        "${result.totalWires} Parallel",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Medium,
                        color = Color.LightGray
                    )
                }
            }
        }
    }
}
