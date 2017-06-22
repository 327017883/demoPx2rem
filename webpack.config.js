
var webpack = require('webpack');
var px2rem = require('postcss-px2rem');
var path = require('path');

var ExtractTextPlugin = require("extract-text-webpack-plugin");

var HtmlWebpackPlugin = require("html-webpack-plugin");

var CleanWebpackPlugin = require('clean-webpack-plugin');

var production = process.env.PRODUCTION;
let output = {};
let filename = '';

//打包
if(production){
	output = {
		path: path.resolve(__dirname, './dist/static/'),
	    filename: 'build.[hash].js'
	 	//chunkFilename: 'js/[name].[chunkhash].min.js'
	};
	filename = path.resolve(__dirname, './dist/index.html');
}
//开发
else{
	output = {
		path: path.resolve(__dirname, './dist/'),
		publicPath: '/',
	    filename: './js/build.js'
	};
	filename = path.resolve(__dirname, './dist/index.html');
}

module.exports = {
	entry: ["./src/js/test.js"],
	output: output,
	module: {
		loaders: [
		  {
		    test: /\.css$/,
		    //loader: new ExtractTextPlugin.extract("style-loader", "css-loader!postcss-loader")
		    use: ExtractTextPlugin.extract({ fallback: 'style-loader', use: ['css-loader', 'postcss-loader' ]})
		    //loader: "style-loader!css-loader!postcss-loader"
		  },
		  {	
		  	test: /\.(png|jpg)$/, 
		  	loader: 'url-loader',
		  	query: {
                limit: 8192,
                name: '[name].[ext]'
            }
		  }
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist'], {
	      root: path.resolve(__dirname),
	      verbose: true, 
	      dry: false
	    }),
		new webpack.LoaderOptionsPlugin({
		 options: {
		   postcss: function() {
				return [px2rem({remUnit: 75})];
			}
		 }
		}),
		new ExtractTextPlugin('[name].[hash].css'),
		new HtmlWebpackPlugin({
			filename: filename,//会生成index.html在根目录下,并注入脚本
			template:'index.tpl',
			chunksSortMode: 'dependency',
			inject:true //此参数必须加上，不加不注入
		})
	]
}