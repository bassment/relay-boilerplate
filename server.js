import path from 'path';
import fs from 'fs';
import express from 'express';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import config from './webpack.config.js';

import Schema from './data/schema';
import GraphQLHTTP from 'express-graphql';
import {MongoClient} from 'mongodb';
import { graphql }  from 'graphql';
import { introspectionQuery } from 'graphql/utilities';

(async () => {
  const isDeveloping = process.env.NODE_ENV !== 'production';
  const port = isDeveloping ? 3000 : process.env.PORT;
  const app = express();
  const db = await MongoClient.connect(process.env.MONGO_URL);
  const schema = Schema(db);

  if (isDeveloping) {
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
      publicPath: config.output.publicPath,
      contentBase: 'src',
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.use(express.static('public'));

    app.use('/graphql', GraphQLHTTP({
      schema,
      graphiql: true
    }));

    app.get('*', function response(req, res) {
      res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
      res.end();
    });

    // Generate schema.json
    const json = await graphql(schema, introspectionQuery);
    fs.writeFile('./data/schema.json', JSON.stringify(json, null, 2), err => {
      if (err) {
        throw err;
      }

      console.log('JSON Schema created!');
    });
  } else {
    app.use(express.static(__dirname + '/dist'));
    app.use(express.static('public'));
    app.get('*', function response(req, res) {
      res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
  }

  app.listen(port, function onStart(err) {
    if (err) {
      console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  });
})();
