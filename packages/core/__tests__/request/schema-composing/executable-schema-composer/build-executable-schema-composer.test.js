import { buildExecutableSchemaComposer } from "../../../../src/request/schema-composing/executable-schema-composer/build-executable-schema-composer";
import { authorService, AUTHOR_RESPONSE,
  bookService, BOOK_RESPONSE,
  getBestTitle,
  extensions,
  servicesTransformations,
  gatewayTransformations,
  mockFetch
} from '../../../fake-data';

import {
  composeExampleSchema,
  exampleExtensionBuilder,
  exampleGatewayTransformer,
  exampleServiceTransformer
} from './utils/schema-composer-utils'

import { createSuccessfulMocks } from './utils/mocks'

import { graphql } from 'graphql';
import fetch from 'node-fetch';


describe('buildExecutableSchemaComposer', () =>
{
  beforeEach(() =>
  {
    jest.resetAllMocks();
    jest.mock('node-fetch', () => jest.fn());
  });
  afterEach(() => jest.unmock('node-fetch'));

  it('should be able to execute query to the schema composed without any plugins', async () =>
  {
    const mergeResult = composeExampleSchema({
      services: [authorService, bookService]
    });

    expect(mergeResult).toBeSuccessful();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const authorResult = await graphql(mergeResult.payload, '{ randomAuthor { name } }');

    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(mergeResult.payload, '{ randomBook { title } }');

    expect(authorResult.data['randomAuthor'].name).toEqual(AUTHOR_RESPONSE.data.randomAuthor.name);
    expect(bookResult.data['randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });

  it('should be able to execute query to the schema composed with plugins', async () =>
  {
    const mergeResult = composeExampleSchema({
      services: [authorService, bookService],
      ...createSuccessfulMocks()
    });

    expect(mergeResult).toBeSuccessful();

    mockFetch(fetch, AUTHOR_RESPONSE);
    const authorResult = await graphql(mergeResult.payload, '{ Gateway_Author_randomAuthor { name, bestTitle } }');


    mockFetch(fetch, BOOK_RESPONSE);
    const bookResult = await graphql(mergeResult.payload, '{ Gateway_Book_randomBook { title } }');

    expect(authorResult.data['Gateway_Author_randomAuthor'].name).toEqual(AUTHOR_RESPONSE.data.randomAuthor.name);
    expect(authorResult.data['Gateway_Author_randomAuthor'].bestTitle).toEqual(getBestTitle(AUTHOR_RESPONSE.data.randomAuthor.name));
    expect(bookResult.data['Gateway_Book_randomBook'].title).toEqual(BOOK_RESPONSE.data.randomBook.title);
  });

  it('should call extensions builder with metadata model', async () =>
  {
    const mocks = createSuccessfulMocks();
    const services = [bookService, authorService];

    const mergeResult = composeExampleSchema({
      services,
      ...mocks
    });

    expect(mergeResult).toBeSuccessful();
    expect(mocks.extensionBuilders[0].buildSchemaExtensions).toHaveBeenCalledWith({ model: mocks.metadata.extensionBuilder });
  });

  it('should call service schema transformer with metadata model for each service', async () =>
  {
    const mocks = createSuccessfulMocks();
    const services = [bookService, authorService];
    const model = mocks.metadata.serviceTransformer;

    const mergeResult = composeExampleSchema({
      services,
      ...mocks
    });

    expect(mergeResult).toBeSuccessful();

    expect(mocks.serviceSchemaTransformers[0].getTransforms).toHaveBeenCalledWith({ model, service: authorService });
    expect(mocks.serviceSchemaTransformers[0].getTransforms).toHaveBeenCalledWith({ model, service: bookService });
  });

  it('should call gateway schema transformer with metadata model', async () =>
  {
    const mocks = createSuccessfulMocks();
    const services = [bookService, authorService];

    const mergeResult = composeExampleSchema({
      services,
      ...mocks
    });

    expect(mergeResult).toBeSuccessful();
    expect(mocks.gatewaySchemaTransformers[0].getTransforms).toHaveBeenCalledWith({ model: mocks.metadata.gatewayTransformer });
  });

  it('should return failure if services transformer returns failure', async () =>
  {
    const services = [bookService, authorService];

    const mergeResult = composeExampleSchema({
      services,
      ...createSuccessfulMocks(),
      serviceSchemaTransformers: [exampleServiceTransformer({
        success: false,
        name: 'serviceTransformer'
      })]
    });

    expect(mergeResult).toBeFailed();
  });

  it('should return failure if gateway transformer returns failure', async () =>
  {
    const services = [bookService, authorService];

    const mergeResult = composeExampleSchema({
      services,
      ...createSuccessfulMocks(),
      gatewaySchemaTransformers: [exampleGatewayTransformer({
        success: false,
        name: 'gatewayTransformer'
      })]
    });

    expect(mergeResult).toBeFailed();
  });

  it('should return failure if extension builder returns failure', async () =>
  {
    const services = [bookService, authorService];

    const mergeResult = composeExampleSchema({
      services,
      ...createSuccessfulMocks(),
      extensionBuilders: [exampleExtensionBuilder({
        success: false,
        name: 'extensionBuilder'
      })]
    });

    expect(mergeResult).toBeFailed();
  });
});