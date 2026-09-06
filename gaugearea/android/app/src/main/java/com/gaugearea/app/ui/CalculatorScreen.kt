package com.gaugearea.app.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Delete
import androidx.compose.material.icons.filled.Tune
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.gaugearea.app.data.SwgData
import com.gaugearea.app.data.SwgEntry

data class WireInputItem(
    val id: String,
    val swg: Int,
    val count: Int
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalculatorScreen(
    onCalculate: (targetArea: Double, wireCount: Int?, tolerance: Double, availableSwgs: Set<Int>) -> Unit
) {
    var wireList by remember {
        mutableStateOf(listOf(WireInputItem(id = "1", swg = 17, count = 1)))
    }
    var tolerancePct by remember { mutableStateOf(5.0) }
    var selectedWireCount by remember { mutableStateOf<Int?>(null) } // null = auto
    var stockSwgs by remember { mutableStateOf(SwgData.DEFAULT_STOCK_SWGS) }

    val totalOriginalArea = wireList.sumOf { item ->
        val area = SwgData.SWG_MAP[item.swg]?.areaMm2 ?: 0.0
        area * item.count
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "GaugeArea",
                            fontWeight = FontWeight.Black,
                            fontSize = 18.sp,
                            color = Color.White
                        )
                        Text(
                            text = "Parallel Wire Calculator",
                            fontSize = 12.sp,
                            color = Color.LightGray
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = MaterialTheme.colorScheme.surface
                )
            )
        },
        bottomBar = {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                tonalElevation = 8.dp,
                modifier = Modifier.fillMaxWidth()
            ) {
                Button(
                    onClick = {
                        onCalculate(totalOriginalArea, selectedWireCount, tolerancePct, stockSwgs)
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                        .height(54.dp),
                    shape = RoundedCornerShape(14.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = MaterialTheme.colorScheme.primary,
                        contentColor = MaterialTheme.colorScheme.onPrimary
                    )
                ) {
                    Text(
                        text = "Calculate Combinations",
                        fontWeight = FontWeight.Bold,
                        fontSize = 16.sp
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(imageVector = Icons.Default.ArrowForward, contentDescription = null)
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
                .verticalScroll(rememberScrollState())
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            // Target Area Summary Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(
                    containerColor = MaterialTheme.colorScheme.surfaceVariant
                )
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "TOTAL TARGET COPPER AREA",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        color = MaterialTheme.colorScheme.primary
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Text(
                        text = String.format("%.4f mm²", totalOriginalArea),
                        fontSize = 28.sp,
                        fontWeight = FontWeight.Black,
                        fontFamily = FontFamily.Monospace,
                        color = Color.White
                    )
                }
            }

            // Original Wire Items
            Text(
                text = "Original Motor Wires",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            wireList.forEachIndexed { index, item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = MaterialTheme.colorScheme.surface
                    )
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        // SWG Selector
                        Column(modifier = Modifier.weight(1f)) {
                            Text(text = "SWG Size", fontSize = 11.sp, color = Color.Gray)
                            var expanded by remember { mutableStateOf(false) }
                            Box {
                                OutlinedButton(
                                    onClick = { expanded = true },
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(8.dp)
                                ) {
                                    Text("SWG ${item.swg}")
                                }
                                DropdownMenu(
                                    expanded = expanded,
                                    onDismissRequest = { expanded = false }
                                ) {
                                    SwgData.SWG_TABLE.forEach { swgEntry ->
                                        DropdownMenuItem(
                                            text = { Text("SWG ${swgEntry.swg} (${swgEntry.areaMm2} mm²)") },
                                            onClick = {
                                                wireList = wireList.toMutableList().also {
                                                    it[index] = it[index].copy(swg = swgEntry.swg)
                                                }
                                                expanded = false
                                            }
                                        )
                                    }
                                }
                            }
                        }

                        // Wire count
                        Column(modifier = Modifier.width(80.dp)) {
                            Text(text = "Count", fontSize = 11.sp, color = Color.Gray)
                            OutlinedTextField(
                                value = item.count.toString(),
                                onValueChange = { str ->
                                    val count = str.filter { it.isDigit() }.toIntOrNull() ?: 1
                                    wireList = wireList.toMutableList().also {
                                        it[index] = it[index].copy(count = count.coerceIn(1, 16))
                                    }
                                },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                singleLine = true,
                                shape = RoundedCornerShape(8.dp)
                            )
                        }

                        // Delete button (if > 1)
                        if (wireList.size > 1) {
                            IconButton(
                                onClick = {
                                    wireList = wireList.filterIndexed { i, _ -> i != index }
                                }
                            ) {
                                Icon(
                                    imageVector = Icons.Default.Delete,
                                    contentDescription = "Remove wire",
                                    tint = Color.Red
                                )
                            }
                        }
                    }
                }
            }

            // Add wire button
            OutlinedButton(
                onClick = {
                    wireList = wireList + WireInputItem(
                        id = System.currentTimeMillis().toString(),
                        swg = 20,
                        count = 1
                    )
                },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp)
            ) {
                Icon(imageVector = Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(6.dp))
                Text("Add Another Wire")
            }

            // Target Wire Count Choice
            Text(
                text = "Target Parallel Wire Count",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White
            )

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                val options = listOf<Pair<String, Int?>>(
                    "Auto (2-6)" to null,
                    "2 Wires" to 2,
                    "3 Wires" to 3,
                    "4 Wires" to 4
                )
                options.forEach { (label, count) ->
                    val isSelected = selectedWireCount == count
                    FilterChip(
                        selected = isSelected,
                        onClick = { selectedWireCount = count },
                        label = { Text(label, fontSize = 12.sp) },
                        shape = RoundedCornerShape(8.dp)
                    )
                }
            }

            // Tolerance Slider
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(12.dp))
                    .background(MaterialTheme.colorScheme.surface)
                    .padding(14.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Area Tolerance", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color.White)
                    Text("±${tolerancePct.toInt()}%", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary)
                }
                Slider(
                    value = tolerancePct.toFloat(),
                    onValueChange = { tolerancePct = it.toDouble() },
                    valueRange = 1f..15f,
                    steps = 14
                )
            }
        }
    }
}
