import { RenameTypes, RenameRootFields } from 'graphql-tools';

export const servicesTransformations = {
  Author: [
    new RenameRootFields((operation, name) => `Author_${name}`),
  ],
  Book: [
    new RenameRootFields((operation, name) => `Book_${name}`),
  ]
};

export const gatewayTransformations = [
  new RenameRootFields((operation, name) => `Gateway_${name}`),
];