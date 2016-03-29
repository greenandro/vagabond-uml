![version](https://badge.fury.io/js/vagabond-uml.svg)
[![Build Status](https://travis-ci.org/hakandilek/vagabond-uml.svg?branch=master)](https://travis-ci.org/hakandilek/vagabond-uml) 
[![Dependencies status](https://david-dm.org/hakandilek/vagabond-uml.svg)](https://david-dm.org/hakandilek/vagabond-uml)
[![devDependency Status](https://david-dm.org/jhipster/jhipster-uml/dev-status.svg)](https://david-dm.org/jhipster/jhipster-uml#info=devDependencies)

# Welcome to Vagabond-UML!

This project is a spin-off from [JHipster's UML model](https://jhipster.github.io/jhipster-uml/) which has a main goal to bring support of UML (more precisely, XMI) files (from various editors) to JHipster. Vagabond-UML uses a similar but enhanced model. Scroll down for further information.

We support: Modelio, UML Designer, GenMyModel and Visual Paradigm... and our DSL!

## TODO
  Here is a brief roadmap
  
  - [ ] Entity model
  - [ ] Service model
  - [ ] Relation model
  - [ ] Annotation model
  - [ ] XMI support
  - [ ] UML Designer
    
# Model Elements

## Entities

Entities are used to form the data model

```java
entity Job {
  Long jobId
  String jobTitle
  Long minSalary 
  Long maxSalary
}
```
In this example a `Job` entity is defined with 4 attributes:
 - `jobId` with type `Long`,
 - `jobTitle` with type `String`,
 - `minSalary` with type `Long`, and a
 - `maxSalary` with type `Long`

## Services

Services represent an operational endpoint as in REST endpoints and hold several 
operations (functions) together.

```java
service Manager {
  void assign(Department department, Employee employee)
  Long countEmployees()
} 
```
This example defines a `Manager` service with two functions:

 - `void assign(Department department, Employee employee)`
   
   `assign` method with a return type of `void` (nothing returned) and 
   two parameters one `Department` and an `Employee`
   
 - `Long countEmployees()`
  
  `countEmployees` method returning a `Long` value with no parameters.
   

## Relations

Relations bind [Entities](#Entities) together.

## Annotations

Annotations are used to represent special characteristics of Entites or Entity attributes.

```java
@paginate(pagination)
entity Job {
  Long jobId
  String jobTitle
}
```
In this example `Job` entity has the `@paginate` annotation with `pagination` property.

```java
@dto(mapstruct)
entity JobHistory {
  startDate ZonedDateTime,
  endDate ZonedDateTime
}
```
In this example `@dto` annotation is applied on the `JobHistory` entity with `mapstruct` 
property.

Annotations can be combined.

```java
@dto(mapstruct)
@paginate(infinite-scroll)
entity Employee {
  Long employeeId 
  String fullName
}
```
In this example `@dto` and `@paginate` annotations are applied together on the 
`Employee` entity.
 
<!--
For more information, visit our [Wiki page](https://getvagabond.github.io/vagabond-uml/) in JHipster's wiki.
-->
