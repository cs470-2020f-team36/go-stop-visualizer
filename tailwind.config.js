module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: ["./src/**/*.html", "./src/**/*.tsx", "./src/**/*.ts"],
  theme: {
    extend: {
      screens: {
        xs: { max: "400px" },
      },
      opacity: {
        15: "0.15",
        35: "0.35",
      },
    },
  },
};
