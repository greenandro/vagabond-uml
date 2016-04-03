'use strict';

const merge = require('../helpers/object_helper').merge;

/**
 * The class holding class data.
 */
class ClassData {
  constructor(values) {
    var merged = merge(defaults(), values);
    this.name = merged.name;
    this.tableName = merged.tableName || this.name;
    this.fields = merged.fields;
    this.comment = merged.comment;
    this.dto = merged.dto;
    this.pagination = merged.pagination;
    this.service = merged.service;
    this.annotations = merged.annotations;
  }

  /**
   * Adds a field to the class.
   * @param {Object} field the field to add.
   * @return {ClassData} this modified class.
   */
  addField(field) {
    this.fields.push(field);
    return this;
  }
  
  /**
   * Adds an annotation to the class.
   * @param {Object} annotation the annotation to add.
   * @return {ClassData} this modified class.
   */
  addAnnotation(annotation) {
    this.annotations[annotation.name] = annotation;
    return this;
  };

  /**
   * Returns annotations of the class.
   * @return Map of annotations
   */
  getAnnotations() {
    return this.annotations;
  };

  /**
   * Returns an annotation of the class.
   * @param {String} name annotation name
   * @return {AnnotationData} the annotation
   */
  getAnnotation(name) {
    return this.annotations[name];
  };
  
}

module.exports = ClassData;

function defaults() {
  return {
    name: '',
    tableName: '',
    fields: [],
    annotations: {},
    comment: '',
    dto: 'no',
    pagination: 'no',
    service: 'no'
  };
}
