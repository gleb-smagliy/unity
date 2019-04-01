/*
  Example:

  // in both cases enhancers are functions

  const headersEnhancers = ({ req }) => ({
    auth: 'foo'
  });

  const headersEnhancers = composeEnhancers({
    auth: ({ req }) => 'foo'
  });

  const enhancers = {
    headers: headersEnhancers
  };
 */


export const composeContextEnhancers = ({

}) => ({

});