module.exports = {
	db_url: 'mongodb://localhost:27017/db',
	port: 80,
	logger_display: 'dev',
	view_engine: 'ejs',
	view_folder: '/src',
	static_folder: '/dist',
	favicon_path: '/dist/favicon.png',
	minify_options: {
		override: true,
		htmlMinifier:{
			removeComments: true,
			collapseWhitespace: true,
			minifyJS: true,
			minifyCSS: true
		}
	},
	session_options: {
		secret: 'iceberg',
		resave: false,
		saveUninitialized: true,
		cookie: {secure: false}
	}
};