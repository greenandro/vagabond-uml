'use strict';

const fs = require('fs'),
    xml2js = require('xml2js'),
    pegParser = require('../dsl/vgGrammar'),
    EditorDetector = require('./editor_detector'),
    Editors = require('./editors'),
    SQLTypes = require('../types/sql_types'),
    MongoDBTypes = require('../types/mongodb_types'),
    CassandraTypes = require('../types/cassandra_types'),
    buildException = require('../exceptions/exception_factory').buildException,
    exceptions = require('../exceptions/exception_factory').exceptions;

/**
 * Creates a parser.
 * @param args {Object} the arguments: file, files, and databaseType.
 * @return {Parser} the created parser.
 */
exports.createParser = function(args) {
  function parse(content, files) {
      try {
        return pegParser.parse(content);            
      } catch (e) {
        if (e instanceof pegParser.SyntaxError) {
          //detailed parse logging
          console.error(e.message);
          console.error(" file     :%s@%s", files, e.location.start.line);
          console.error(" expected :%s", JSON.stringify(e.expected));
          console.error(" found    :%s", JSON.stringify(e.found));
          console.error(" location :%s", JSON.stringify(e.location));
        } else {
          logError(e);          
        }
        throw e;
      }
  };
  
  if (!args || (!args.file && !args.files) || !args.databaseType) {
    throw new buildException(
        exceptions.IllegalArgument,
        'The file/s and the database type must be passed');
  }
  var types = initDatabaseTypeHolder(args.databaseType);
  if (args.file) { // standard mode
    return getParserForSingleFile(args.file, types);
  } else if (args.files) {
    return getParserForMultipleFiles(args.files, types);
  }
};

function getParserForSingleFile(file, types) {
  if (endsWith(file, '.vg') || endsWith(file, '.vgb')) {
    return new Editors.Parsers.dsl(pegParser.parse(readJDLFile(file)), types);
  } else {
    return getXMIFileParser(file, types);
  }
}

function getParserForMultipleFiles(files, types) {
  if (areFilesJhFiles(files)) {
    return new Editors.Parsers.dsl(pegParser.parse(aggregateFiles(files)), types);
  } else {
    throw new buildException(
        exceptions.IllegalArgument,
        'Only one XMI file can be passed, and mixing JDL and XMI files is not allowed.');
  }
}

function getXMIFileParser(file, databaseType) {
  var root = getRootElement(readFileContent(file));
  var detectedEditor = EditorDetector.detect(root);
  return new Editors.Parsers[detectedEditor](root, databaseType);
}

function areFilesVgbFiles(files) {
  return files.every(function(file) {
    return endsWith(file, '.vg') || endsWith(file, '.vgb');
  });
}

function aggregateFiles(files) {
  var content = '';
  files.forEach(function (file) {
    content = content + '\n' + readJDLFile(file);
  });
  return content;
}

function readJDLFile(file) {
  return fs.readFileSync('./' + file).toString();
}

function readFileContent(file) {
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    throw new buildException(
        exceptions.WrongFile,
        `The passed file '${file}' must exist and must not be a directory.`);
  }
  return fs.readFileSync(file, 'utf-8');
}

function logError(error) {
  if (error instanceof Error) {
    console.error("%s : %s", error.name, error.type);
    console.error(error.stack);
  } else {
    console.error(error);
  }
}

function getRootElement(content) {
  var root;
  var parser = new xml2js.Parser();
  parser.parseString(content, function (err, result) {
    if (err) {
      logError(new Error("getRootElement <- err:" + err));
      return;
    }
       
    if (result.hasOwnProperty('uml:Model')) {
      root = result['uml:Model'];
    } else if (result.hasOwnProperty('xmi:XMI')) {
      root = result['xmi:XMI']['uml:Model'][0];
    } else {
      throw new buildException(
          exceptions.NoRoot,
          'The passed document has no immediate root element.');
    }
  });
  return root;
}

function initDatabaseTypeHolder(databaseTypeName) {
  switch (databaseTypeName) {
    case 'sql':
      return new SQLTypes();
    case 'mongodb':
      return new MongoDBTypes();
    case 'cassandra':
      return new CassandraTypes();
    default:
      throw new buildException(exceptions.WrongDatabaseType,
          'The passed database type is incorrect. '
          + "It must either be 'sql', 'mongodb', or 'cassandra'."
          + `Got '${databaseTypeName}'.`);
  }
}

function endsWith(str, suffix) {
  return str.indexOf(suffix, str.length - suffix.length) !== -1;
}
