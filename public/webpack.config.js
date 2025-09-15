const path = require("path");

module.exports = {
  // Entry point of your React app
  entry: "./src/index.js",

  // Output configuration
  output: {
    path: path.resolve(__dirname, "dist"), // bundle location
    filename: "bundle.js",
    clean: true, // cleans /dist before build
  },

  // Module rules
  module: {
    rules: [
      {
        test: /\.js$/i,           // Transform .js files
        exclude: /node_modules/,  // Skip node_modules
        use: {
          loader: "babel-loader", // Use Babel
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"], // Support JSX and modern JS
          },
        },
      },
      {
        test: /\.css$/i,          // Transform CSS
        use: ["style-loader", "css-loader"],
      },
    ],
  },

  // Resolve .js and .jsx extensions
  resolve: {
    extensions: [".js", ".jsx"],
  },

  // Dev server for local development
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 3000,
    open: true,
  },

  // Mode can be overridden via CLI (webpack --mode production)
  mode: "development",
};
