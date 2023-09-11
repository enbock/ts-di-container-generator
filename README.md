# Dependency Injection Container Generator for TypeScript

A generator to automatically create a dependency injection container by static code analysis.

## License

[MIT](LICENSE)

## Motivation

In the world of application development, we are using pattern like S.O.L.I.D. This pattern helping us to separate
the code and avoiding monolithic code.    
It is not related to a language! If we write a Java Application, a .Net-Application or a C++ GTK Application.

In all that cases exists a system to collecting the dependencies and injecting it into the code units. Here often we
use **Inverse Dependency Injection Principles**.    
That means, that the dependency is not taken by using code unit. Therefore, the injection is given from outside.

To automatise that exists in mostly each framework a dependency container system. We knew it from .net-Core Host-Service
System, PHP Symfony DI, and so on.

This library creates a way, to inject dependencies in Web-Applications via a similar principle as almost any other
application development frame outside of JavaScript/TypeScript it does.

## How it works

The code analyser searches for the `const RootDependency` property inside the index(main) files. From here it follows
the import to build a map of dependencies.

Al least, it creates a `sourceFolder/DependencyInjection/Container.ts` and provides the `DependencyInjectionContainer`
singleton to access the container.

## Usage

### Start dependency marker

The given main program file (like `index.ts`) have to have a `const RootDependency` property. That is the start
dependency marker for the static code analyser.

### Run generator

*Syntax:*

```
npx @enbock/ts-di-container-generator <source-directory> <start-file> [... <excluded-file-or-path>]
```

Example

```shell
npx @enbock/ts-di-container-generator src index
```

# FAQ

## Why no runtime annotation system?

The dependency tree will grow in bigger projects. That lead into a stronger memory and processor usage.
To avoid issues in runtime, this tool generates the container before running and compiling the project.

## When I have to run this tool?

In common Web Applications is almost `webpack` used. This tool must be run, bevor webpack compiles the code.

## Should I commit the dependency injection container?

Yes you should.     
The generated code is part of your project.

## Why interface instances are not generated?

Interface build a ... yes ... interface to hide real and allow multiple implementations. In reason, that the code
analyzer starts on the delivery side(see Clean Architecture), it can not identify, which of the implementation is used
for the interface.

Therefore, you the to create for i.e. call chains or Infrastructure(Entity Gateway Interface implementations) instances,
the objects by your own **or** place "generate requests" by adding properties to the `AdditionalResources` interface.

Fill the objects `interfaceInstances` and `manualInjections` with your project specific or generated dependencies.

Both objects will stay on while regeneration.

## I have a resource, that need also data from `manualInjections`. How I can handle it?

Yeah, here we got a cycle. If you need to fill resources into `manualInjections` which needs also resources **from**
the `manualInjections`, then you can do follow way/trick:

1. Fill the **second** resource with `undefined!`:
   ```typescript
    class Container {
        // ***snip***
        private manualInjections: ManualInjections = {
            firstResource: new TheBaseResource(),
            secondResource: undefined!
        }
        // ***snip***
    }
   ```
2. Create in the container `constructure` function the **second** resource manually`
   ```typescript
    class Container {
        // ***snip***
        constructor() {
            this.manualInjections.secondResource = new MyRequestedResource(this.manualInjections.firstResource)
        }
        // ***snip***
    }
   ```

## Can I update the DI container?

Yes, just run this tool again.

Follow elements will be taken from before generated container:

* `ManualInjections`
* `InterfaceInstances`
* `AdditionalResources`
* `private manualInjections: ManualInjections`
* `private interfaceInstances: InterfaceInstances`
* `constructor()`

Also, the imports for the types of the `ManualInjections`, `InterfaceInstances` and `AdditionalResources` will be taken.

## I want, that the generator create extra resources for me!

That you can do!

Just place a property in `AdditionalResources` and run the generator.
Afterward you will find the generated resource. You can use it for fill, (as example) processing chains.

*Be aware*, that the generated resource will get a global unique alias. Also, the property names
in `AdditionalResources` will be ignored

**Tip:** Replace your manual imported Class with the generated alias.

Example:

```typescript

interface AdditionalResources {
    // ***snip***
    theFancyClassParser: InfrastructureFileParserClassParser;
    infrastructureFileParserImportParser: InfrastructureFileParserImportParser;
    infrastructureFileParserInterfaceParser: InfrastructureFileParserInterfaceParser;
    infrastructureFileParserRootDependencyParser: InfrastructureFileParserRootDependencyParser;
    // ***snip***
}

class Container {
    private manualInjections: ManualInjections = {
        // ***snip***
        infrastructureFileTypeScriptParsers: [
            this.infrastructureFileParserClassParser,
            this.infrastructureFileParserImportParser,
            this.infrastructureFileParserInterfaceParser,
            this.infrastructureFileParserRootDependencyParser
        ],
        // ***snip***
    }
}
```