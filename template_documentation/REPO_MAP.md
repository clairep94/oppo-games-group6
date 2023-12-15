# Project Repo Map:

This is a working map of our project directory

For each new feature, we must create/modify:

- `API/app.js` (only for new schema, create the schema root endpoint)
- `API/Model` (only for new schema or schema change)
- `API/Controller`
- `API/Route`
- `API/specs` -- tests for each of the above

- `Frontend/src/components` and/or `Frontend/src/pages` -- this is flexible depending on the feature
- `Frontend/src/components/app/App.js` -- if adding a new page or temporarily viewing a component, add a new route


## API:


### Bin:
- Creates the server -- no need to touch for the most part

### Controllers:
- Controllers for our DB models. These perform the CRUD-related tasks for our API.
- TODO To discuss: Should we add _controller to the end of each file?

### Lib:
This contains the token generator -- no need to touch, unless changing the time-out time

### Models:
- Our model classes. One for each schema for our MongoDB database.
- TODO To discuss: Alterations of an existing model class that uses the .populate method will require us wiping the DB after each change, so everyone is aware

### Node_Modules:
- Ignore

### Routes:
- Creating the HTTP endpoints for our controllers.
- TODO To discuss: careful syntax conventions here & renaming of the Acebook User and UserData routes clean-up

### Spec:
- All tests -- has subfolders for each of the above with corresponding files and tests


## FRONTEND:

### Cypress/e2e:
- FE tests

### Node_Modules:
- Ignore

### Public:
- Ignore for now

### SRC/:
<hr>

#### Assets:
- Image assets

#### Components:
- All individual components, NOT pages. For example, Navbar
- TODO To discuss: ideas for best naming conventions for folders here
- Please use `_____.module.css` so that CSS styles do not over-write one another
- Unit tests for FE components

#### Components/app.js:

- ALL FRONTEND ROUTES -- linking frontend URLs with Pages

#### Pages:

- All pages, which may be a combination of components

## Public:

## Stylesheets:

- Ignore for now, as we may use `_____.module.css` for flexibility