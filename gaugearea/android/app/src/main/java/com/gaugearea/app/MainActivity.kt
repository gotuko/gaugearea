package com.gaugearea.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Calculate
import androidx.compose.material.icons.filled.TableChart
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import com.gaugearea.app.data.CombinationResult
import com.gaugearea.app.data.SwgData
import com.gaugearea.app.ui.CalculatorScreen
import com.gaugearea.app.ui.ReferenceScreen
import com.gaugearea.app.ui.ResultsScreen
import com.gaugearea.app.ui.theme.GaugeAreaTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            GaugeAreaTheme {
                MainAppContent()
            }
        }
    }
}

@Composable
fun MainAppContent() {
    var selectedTab by remember { mutableStateOf(0) } // 0 = Calculator, 1 = Reference Table
    var currentTargetArea by remember { mutableStateOf(0.0) }
    var currentResults by remember { mutableStateOf<List<CombinationResult>>(emptyList()) }
    var showResults by remember { mutableStateOf(false) }

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            if (!showResults) {
                NavigationBar(
                    containerColor = MaterialTheme.colorScheme.surface
                ) {
                    NavigationBarItem(
                        selected = selectedTab == 0,
                        onClick = { selectedTab = 0 },
                        icon = { Icon(Icons.Default.Calculate, contentDescription = "Calculator") },
                        label = { Text("Calculator") }
                    )
                    NavigationBarItem(
                        selected = selectedTab == 1,
                        onClick = { selectedTab = 1 },
                        icon = { Icon(Icons.Default.TableChart, contentDescription = "SWG Table") },
                        label = { Text("SWG Table") }
                    )
                }
            }
        }
    ) { innerPadding ->
        Surface(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding),
            color = MaterialTheme.colorScheme.background
        ) {
            when {
                showResults -> {
                    ResultsScreen(
                        targetArea = currentTargetArea,
                        results = currentResults,
                        onBack = { showResults = false }
                    )
                }
                selectedTab == 0 -> {
                    CalculatorScreen(
                        onCalculate = { targetArea, wireCount, tolerance, availableSwgs ->
                            currentTargetArea = targetArea
                            currentResults = SwgData.calcCombinations(
                                targetArea = targetArea,
                                wireCountChoice = wireCount,
                                tolerancePct = tolerance,
                                availableSwgs = availableSwgs
                            )
                            showResults = true
                        }
                    )
                }
                selectedTab == 1 -> {
                    ReferenceScreen()
                }
            }
        }
    }
}
