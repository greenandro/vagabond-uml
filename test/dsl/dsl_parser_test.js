"use strict"

var ParserFactory = require('../../lib/editors/parser_factory'),
    expect = require('chai').expect,
    fail = expect.fail,
    SQLTypes = require('../../lib/types/sql_types'),
    MongoDBTypes = require('../../lib/types/mongodb_types'),
    CassandraTypes = require('../../lib/types/cassandra_types');

var parser = ParserFactory.createParser({
  file: 'test/vag/oracle.vag',
  databaseType: 'sql'
});

/* The parser with an undeclared entity in a relationship */
var parserUndeclaredEntity = ParserFactory.createParser({
  file: 'test/vag/UndeclaredEntity.vag',
  databaseType: 'sql'
});

/* The parser with a wrong type */
var parserWrongType = ParserFactory.createParser({
  file: 'test/vag/WrongType.vag',
  databaseType: 'sql'
});

/* The parser with an enum */
var parserEnum = ParserFactory.createParser({
  file: 'test/vag/enum.vag',
  databaseType: 'sql'
});

/* The parser with an enum */
var parserAnnotations = ParserFactory.createParser({
  file: 'test/vag/annotations.vag',
  databaseType: 'sql'
});

describe("DSL Parser", function(){
  describe("#fillClassesAndFields", function(){
    describe("when the classes and fields are created",function(){
      before(function(){
        parser.fillEnums();
        parser.fillClassesAndFields();
      });

      it("there is the expected number of classes",function(){
        expect(Object.keys(parser.parsedData.classes).length).to.be.equal(8);
      });
      it("there is the expected number of field",function(){
        expect(Object.keys(parser.parsedData.fields).length).to.be.equal(28);
      });
      it("the class Object is well formed",function(){
        var classObj = parser.parsedData.classes["Employee"];
        expect(classObj.name).to.be.equals('Employee');
        expect(classObj.fields.length).to.be.equals(8);
      });
      it("the field Object is well formed",function(){
        var firstNameFields = parser.parsedData.fields["Employee_firstName"];
        expect(firstNameFields.name).to.be.equals("firstName");
        expect(firstNameFields.type).to.be.equals("String");
        expect(firstNameFields.validations).to.deep.equal([]);
      });
    });

    describe('when trying to add a field whose name is capitalized', function() {
      it('decapitalizes and adds it', function() {
        var otherParser = ParserFactory.createParser({
          file: 'test/vag/capitalized_field_name.vag',
          databaseType: 'sql'
        });
        otherParser.fillClassesAndFields();
        if (Object.keys(otherParser.parsedData.fields).length === 0) {
          fail();
        }
        Object.keys(otherParser.parsedData.fields).forEach(function(fieldData) {
          if (otherParser.parsedData.fields[fieldData].name.match('^[A-Z].*')) {
            fail();
          }
        });
      });
    });

    describe("When a field has a type not supported by JHipster",function(){
      it("throws an parsing exception",function(){
        try{
          parserWrongType.fillEnums();
          parserWrongType.fillClassesAndFields();
        }catch(error){
          expect(error.name).to.be.equal("InvalidTypeException");
        }
      });
    });

    describe("When an enum is declared", function(){
      it("the enums in result are well formed",function(){
       expect(parserEnum.result.enums[0].name).to.be.equal("Language");
       expect(parserEnum.result.enums[0].values.length).to.be.equal(4);
      });

      it("the enum Object is well formed",function(){
       parserEnum.fillEnums();
       parserEnum.fillClassesAndFields();

       expect(parserEnum.parsedData.getEnum('Language').name).to.be.equal("Language");
       expect(parserEnum.parsedData.getEnum('Language').values.length).to.be.equal(4);
      });

    });

    describe("When entities have annotations", function(){
      
      it("the annotations in result are well formed",function(){
       //Book
       expect(parserAnnotations.result.entities[0].annotations.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[0].annotations[0].name).to.be.equal("paginate");
       expect(parserAnnotations.result.entities[0].annotations[0].parameters.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[0].annotations[0].parameters[0].name).to.be.equal("pagination");
       expect(parserAnnotations.result.entities[0].annotations[0].parameters[0].value).to.be.equal(true);
       //MultipleAnnotations
       expect(parserAnnotations.result.entities[1].annotations.length).to.be.equal(2);
       expect(parserAnnotations.result.entities[1].annotations[0].name).to.be.equal("dto");
       expect(parserAnnotations.result.entities[1].annotations[0].parameters.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[1].annotations[0].parameters[0].name).to.be.equal("mapstruct");
       expect(parserAnnotations.result.entities[1].annotations[0].parameters[0].value).to.be.equal(true);
       expect(parserAnnotations.result.entities[1].annotations[1].name).to.be.equal("paginate");
       expect(parserAnnotations.result.entities[1].annotations[1].parameters.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[1].annotations[1].parameters[0].name).to.be.equal("infinite-scroll");
       expect(parserAnnotations.result.entities[1].annotations[1].parameters[0].value).to.be.equal(true);
       //A1
       expect(parserAnnotations.result.entities[2].annotations.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[2].annotations[0].name).to.be.equal("noParams");
       expect(parserAnnotations.result.entities[2].annotations[0].parameters.length).to.be.equal(0);
       //A2
       expect(parserAnnotations.result.entities[3].annotations.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[3].annotations[0].name).to.be.equal("noParams");
       expect(parserAnnotations.result.entities[3].annotations[0].parameters.length).to.be.equal(0);
       //B1
       expect(parserAnnotations.result.entities[4].annotations.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[4].annotations[0].name).to.be.equal("multiParams");
       expect(parserAnnotations.result.entities[4].annotations[0].parameters.length).to.be.equal(3);
       expect(parserAnnotations.result.entities[4].annotations[0].parameters[0].name).to.be.equal("a");
       expect(parserAnnotations.result.entities[4].annotations[0].parameters[0].value).to.be.equal(true);
       expect(parserAnnotations.result.entities[4].annotations[0].parameters[1].name).to.be.equal("B");
       expect(parserAnnotations.result.entities[4].annotations[0].parameters[1].value).to.be.equal(true);
       expect(parserAnnotations.result.entities[4].annotations[0].parameters[2].name).to.be.equal("c1");
       expect(parserAnnotations.result.entities[4].annotations[0].parameters[2].value).to.be.equal(true);
       //B2
       expect(parserAnnotations.result.entities[5].annotations.length).to.be.equal(1);
       expect(parserAnnotations.result.entities[5].annotations[0].name).to.be.equal("multiParams");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters.length).to.be.equal(8);
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[0].name).to.be.equal("a");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[0].value).to.be.equal(true);
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[1].name).to.be.equal("B");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[1].value).to.be.equal("asd");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[2].name).to.be.equal("c");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[2].value).to.be.equal(42);
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[3].name).to.be.equal("d");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[3].value).to.be.equal(3.41);
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[4].name).to.be.equal("e");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[4].value).to.be.equal(true);
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[5].name).to.be.equal("f");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[5].value).to.be.equal("EN");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[6].name).to.be.equal("g");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[6].value).to.be.equal(null);
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[7].name).to.be.equal("h");
       expect(parserAnnotations.result.entities[5].annotations[0].parameters[7].value).to.be.equal(true);
      });

      it("the annotations are well formed",function(){
       parserAnnotations.fillEnums();
       parserAnnotations.fillClassesAndFields();
       
       expect(parserAnnotations.parsedData.getClass('Book').getAnnotation("paginate").name).to.be.equal("paginate");
       expect(parserAnnotations.parsedData.getClass('Book').getAnnotation("paginate").getParameter("pagination")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('MultipleAnnotations').getAnnotation("dto").name).to.be.equal("dto");
       expect(parserAnnotations.parsedData.getClass('MultipleAnnotations').getAnnotation("dto").getParameter("mapstruct")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('MultipleAnnotations').getAnnotation("paginate").name).to.be.equal("paginate");
       expect(parserAnnotations.parsedData.getClass('MultipleAnnotations').getAnnotation("paginate").getParameter("infinite-scroll")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('A1').getAnnotation("noParams").name).to.be.equal("noParams");
       expect(parserAnnotations.parsedData.getClass('A2').getAnnotation("noParams").name).to.be.equal("noParams");
       expect(parserAnnotations.parsedData.getClass('B1').getAnnotation("multiParams").name).to.be.equal("multiParams");
       expect(parserAnnotations.parsedData.getClass('B1').getAnnotation("multiParams").getParameter("a")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('B1').getAnnotation("multiParams").getParameter("B")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('B1').getAnnotation("multiParams").getParameter("c1")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").name).to.be.equal("multiParams");
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("a")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("B")).to.be.equal("asd");
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("c")).to.be.equal(42);
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("d")).to.be.equal(3.41);
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("e")).to.be.equal(true);
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("f")).to.be.equal("EN");
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("g")).to.be.equal(null);
       expect(parserAnnotations.parsedData.getClass('B2').getAnnotation("multiParams").getParameter("h")).to.be.equal(true);
      });

    });

  });

  describe("#fillAssociations", function(){
    describe("When the relationships are created",function(){
      before(function(){
        parser.fillEnums();
        parser.fillClassesAndFields();
        parser.fillAssociations();
      });
      it("there is the expected number of relationships",function(){
        expect(Object.keys(parser.parsedData.associations).length).to.be.equal(10);
      });
      it("the associations Object is well formed",function(){
        expect(parser.parsedData.getAssociation("Department_employee_to_Employee_null").from).to.be.equal("Department");
        expect(parser.parsedData.getAssociation("Department_employee_to_Employee_null").type).to.be.equal("one-to-many");
      });
    });

    describe("When an entity in a relationship is not declared",function(){
      before(function(){
        parserUndeclaredEntity.fillClassesAndFields();
      });

      it("throws an UndeclaredEntityException",function(){
        try{
          parserUndeclaredEntity.fillAssociations();
        }catch(error){
          expect(error.name).to.be.equal("UndeclaredEntityException");
        }
      });
    });

  });
});

function contains(a, obj) {
    var i = a.length;
    while (i--) {
       if (a[i] === obj) {
           return true;
       }
    }
    return false;
}