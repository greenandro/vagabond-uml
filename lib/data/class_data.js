'use strict';

const merge = require('../helpers/object_helper').merge;

/**
 * The class holding class data.
 */
var ClassData = module.exports = function(values) {
  var defaults = {
    name: '',
    tableName : '',
    fields: [],
    annotations: {},
    comment: '',
    dto: '',
    pagination: '',
    service: ''
  };

  var merged = merge(defaults, values);
  this.name = merged.name;
  this.tableName = merged.tableName || this.name;
  this.fields = merged.fields;
  this.annotations = merged.annotations;
  this.comment = merged.comment;
  this.dto = merged.dto || 'no';
  this.pagination = merged.pagination || 'no';
  this.service = merged.service || 'no';
};

/**
 * Adds a field to the class.
 * @param {Object} field the field to add.
 * @return {ClassData} this modified class.
 */
ClassData.prototype.addField = function(field) {
  this.fields.push(field);
  return this;
};

/**
 * Adds an annotation to the class.
 * @param {Object} annotation the annotation to add.
 * @return {ClassData} this modified class.
 */
ClassData.prototype.addAnnotation = function(annotation) {
  this.annotations[annotation.name] = annotation;
  return this;
};

/**
 * Returns annotations of the class.
 * @return Map of annotations
 */
ClassData.prototype.getAnnotations = function() {
  return this.annotations;
};

/**
 * Returns an annotation of the class.
 * @param {String} name annotation name
 * @return {AnnotationData} the annotation
 */
ClassData.prototype.getAnnotation = function(name) {
  return this.annotations[name];
};
