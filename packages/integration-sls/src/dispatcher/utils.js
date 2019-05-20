const TAG = {
    HEADER: 'X-Tag',
    PARAMETER: 'tag'
};

const VERSION = {
    HEADER: 'version',
    PARAMETER: 'X-Version'
};

const isValidString =  value => typeof(value) === 'string' && value !== null;

const getHeader = (headers, name) =>
{
    const key = Object.keys(headers).find(h => h.toLowerCase() === name.toLowerCase());

    if(!isValidString(key))
    {
        return undefined;
    }

    return headers[key];
};

module.exports =
{
    getTag: event =>
    {
        let { headers, queryStringParameters } = event;
        headers = headers || {};
        queryStringParameters = queryStringParameters || {};

        const tagQueryParameter = queryStringParameters[TAG.PARAMETER];

        if(isValidString(tagQueryParameter))
        {
            return tagQueryParameter;
        }

        return getHeader(headers, TAG.HEADER);
    },
    getVersion: event =>
    {
        let { headers, queryStringParameters } = event;

        headers = headers || {};
        queryStringParameters = queryStringParameters || {};

        const versionQueryParameter = queryStringParameters[VERSION.PARAMETER];

        if(isValidString(versionQueryParameter))
        {
            return versionQueryParameter;
        }

        return getHeader(headers, VERSION.HEADER);
    }
};
