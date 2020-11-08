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
    },
  },
};
