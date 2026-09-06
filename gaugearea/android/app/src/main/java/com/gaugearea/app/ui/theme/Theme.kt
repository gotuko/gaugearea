package com.gaugearea.app.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

val AmberPrimary = Color(0xFFF59E0B)
val AmberOnPrimary = Color(0xFF0F172A)
val SlateBackground = Color(0xFF020617)
val SlateSurface = Color(0xFF0F172A)
val SlateSurfaceVariant = Color(0xFF1E293B)
val SlateBorder = Color(0xFF334155)
val EmeraldSuccess = Color(0xFF10B981)
val RoseError = Color(0xFFF43F5E)

private val DarkColorScheme = darkColorScheme(
    primary = AmberPrimary,
    onPrimary = AmberOnPrimary,
    background = SlateBackground,
    surface = SlateSurface,
    surfaceVariant = SlateSurfaceVariant,
    onBackground = Color(0xFFF8FAFC),
    onSurface = Color(0xFFF8FAFC)
)

private val LightColorScheme = lightColorScheme(
    primary = AmberPrimary,
    onPrimary = AmberOnPrimary,
    background = Color(0xFFF8FAFC),
    surface = Color(0xFFFFFFFF),
    surfaceVariant = Color(0xFFF1F5F9),
    onBackground = Color(0xFF0F172A),
    onSurface = Color(0xFF0F172A)
)

@Composable
fun GaugeAreaTheme(
    darkTheme: Boolean = true, // Default to workshop dark theme
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
