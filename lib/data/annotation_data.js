'use strict';

const merge = require('../helpers/object_helper').merge;

/**
 * The class holding annotation data.
 */
var AnnotationData = module.exports = function(values) {
  var defaults = {
    name: '',
    parameters: { },
    comment: ''
  };

  var merged = merge(defaults, values);
  this.name = merged.name || this.name;
  this.comment = merged.comment;
  this.parameters = { };
  merged.parameters.forEach(function (parameter) {
      this.addParameter(parameter);      
    }, this);
};

/**
 * Adds a parameter to the annotation.
 * @param {Object} parameter the parameter to add.
 * @return {AnnotationData} this modified annotation.
 */
AnnotationData.prototype.addParameter = function(parameter) {
  this.parameters[parameter.name]=parameter.value;
  return this;
};

/**
 * Lists parameters of the annotation.
 * @return {Map} of parameters
 */
AnnotationData.prototype.getParameters = function() {
  return this.parameters;
};


/**
 * Lists parameters of the annotation.
 * @param {String} name name of the parameter
 * @return {Object} value of parameter 
 */
AnnotationData.prototype.getParameter = function(name) {
  return this.parameters[name];
};
