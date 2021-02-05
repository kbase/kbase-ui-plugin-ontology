# KBase UI Plugin: Ontology

> View ontology terms, and navigate within an ontology.

This is a plugin for [kbase-ui](https://github.com/kbase/kbase-ui), which allows a KBase user to view individual ontological terms, and navigate within the ontology to which that term belongs.

The canonical home for it is https://narrative.kbase.us#ontology.

Currently the Ontology plugin supports [Gene Ontology (GO)](http://geneontology.org) and [Environment Ontology (ENVO)](http://www.environmentontology.org) ontologies.

## Usage

Ontology terms are typically linked from other parts of KBase, although you can simply invoke the appropriate url to view them, if you know the url format and the term involved.

While viewing a term, other terms are exposed as links. For example, since ontologies are trees, you can view parents and children of a term and click on them to view them. Therefore, this tool enables you to navigate an entire ontology.
<!-- 
### Viewing a Term

[https://ci.kbase.us#ontology/term/go_ontology/GO:0008152](https://narrative.kbase.us#ontology/go_ontology/GO:0008152) will show the term for "metabolic process" in the Gene Ontology. -->

<!-- [](https://ci.kbase.us#ontology/envo/) -->
## Usage

As a kbase-ui plugin, the ontology landing page is invoked with a base of `https://ENV.kbase.us`, where `ENV` is the deployment environment such as `narrative` for production, and a path formed by the url fragment, commonly know as the _hash_ due to the usage of the `#` character to prefix it, the base of which is `#ontology`.

See the API section below for details of the URL format.

Although a link to an ontology term may be embedded in a document as any url, they are typically dynamically generated by KBase web apps.

A KBase account is required to access the ontology plugin.

## Install

This plugin is a dependency of [kbase-ui](https://github.com/kbase/kbase-ui).

## Background

This plugin exists to provide an endpoint for inspecting an ontology term.

## API
### General URL

The general form is:

```url
https://ENV.kbase.us#ontology/term/NAMESPACE/ID[/TIMESTAMP]
```

where:

- `ENV` is the KBase deployment environment, `narrative`, `next`, `ci`, and others.
- `ontology` is the dispatch name for the ontology plugin
- `term` indicates we want the term viewer
- `NAMESPACE` is the Relation Engine (RE) namespace; current namespaces include: `envo_ontology`, `go_ontology`.
- `ID` is the ontology term; it should be the same as the native ontology term for the given ontology.
- `TIMESTAMP` is an optional epoch timestamp in milliseconds; it represents the point in time at which to consider the ontology, and defaults to the current time. Ontologies are updated periodically; in order to manage changes to ontologies over time, updated, new, or deleted terms are marked with start and end timestamps, as appropriate, to define when they are to be considered effective.

### URL Examples

The ontology landing page is meant to be linked to from other apps which expose an ontology term assignment.

#### GO Ontology "metabolic process"

```url
https://narrative.kbase.us#ontology/go_ontology/GO:0008152
```

will show the current term for "metabolic process" in the Gene Ontology.

#### GO Ontology "metabolic process" 1/1/2021

```url
https://narrative.kbase.us#ontology/go_ontology/GO:0008152/1609459200000
```

will show the same term effective on January 1, 2021.

## License
SEE LICENSE IN LICENSE.md
