![](https://user-images.githubusercontent.com/2143349/72977784-7fd1b680-3dd5-11ea-917a-3bfe7660f590.png)

# Pixie & Dixie API - The ultimate search!
Pixie & Dixie API is the dark side of the Pixie & Dixie ultimate universe!<br>
Checkout the [[1] Pixie & Dixie Front-end][#frontend] for full setup.

## Installation
Clone stuff obviously:

    $ git clone git@github.com:Dorious/pixiedixie-api.git
	
And install what is necessary:

	$ npm install
### Configuration
Copy `config.example.json` file to your `config.json`:

	$ cp config.example.json config.json
Edit it in your favourite editor and add Giphy && Pixabay API keys where it's obvious (hint: `"apiKey"`).
    
### Running
Inside `config.json` you can change `"port"` and then just:

	$ npm start
	
	> pixiedixie-api@1.0.0 start C:\Users\darius.arc\Projects\Git\pixiedixie-api
	> ts-node-dev --no-notify --respawn --transpileOnly src/index.ts

	Using ts-node version 8.6.2, typescript version 3.7.5
	Setting up "/api/v1" API prefix...
	Server running @ http://localhost:8001/api/v1

Go to [[2] http://localhost:8001/api/v1][#apidoc] for basic API documentation.
    
### Testing

	$ npm run test

Wasn't really focused fully on TDD honestly. More prototype approach.<br>
But just added some features like mocking axios queries.

### Production
No Dockerimage at the time of writing. Just build and run:

	$ npm run build
    $ npm run production
It will compile TS into ES6 and run the server.

## Development
Some description what I did so far:
### Used techs/libs:
1. NodeJS
2. TypeScript
3. Express
4. Axios (moxios for mocking)
5. Jest (with ts-jest preset)

#### DataSources - `src/datasources`
As I wanted data sources to be easily added to the site I've implemented `Adapter` pattern where each provider has own class (extended from abstract DataSourceAdapter) with proper interfaces.

#### Responses - `src/responses`
Basically here you put your router responses methods.<br>
Add them later in `src/app.ts` like the others with `getHandler` method.

NOTE: This could be refactor a lil bit because every route right now uses the same `getHandler` method.

## TODO
1. Be more TS strict in some places like put return types of each function.
2. DataSources some refactor. Some code is duplicated there and I could make.
3. Error handling could be in some places better.
3. Dynamic offset/count. The problem with multiple sources is that when you want to get 30 results you don't know will you get the same amount so sometimes you can have gaps. Need to find a nice way to fill that gaps.
4. More documentation in the code.
5. Others:
	* Minify `dist` build.

[#frontend]: https://github.com/Dorious/pixiedixie-web "Front-end part for full setup"
[#apidoc]: http://localhost:8001/api/v1 "API generated documentation"