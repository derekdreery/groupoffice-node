# Groupoffice-Node

A port of groupoffice over to node.js

## Design decisions

### Javascript

	- All models created from mongoose.model
	- Shared model functionality provided by mixins
  - Prototype-based inheritance, with exceptions to the rule
