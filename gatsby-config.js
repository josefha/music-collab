
require("dotenv").config()

module.exports = {
  plugins: [
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        features: {
          auth: true,
          database: true,
          firestore: false,
          storage: false,
          messaging: false,
          functions: false,
          performance: false,
        },
      },
    },
  ],
}