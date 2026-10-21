# Architecture rules

- Keep tint/shade parsing and RGB mixing in a pure utility with calculation tests so every output and export uses the same values.
- Use the shared ColourToolLinks component for cross-tool navigation, transferring selected hex colours via the existing colors query parameter.
- Localize static brand copy and colour-tool controls in the existing locale JSON files so changing languages never changes functionality.