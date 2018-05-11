exports.files = {
  javascripts: {
    entryPoints: {
      'js/main.js': "app.js"
    },
    joinTo: {
      "app.js": /\.js$/
    }
  },
};

exports.paths = {
  public: "built-js",
  watched: ['js']
}

exports.plugins = {
  babel: {
    presets: ['es2015']
  }
}
