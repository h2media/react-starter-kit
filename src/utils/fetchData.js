import xml2js from 'xml2js';

const fetchData = async (params) => {
    const resp = await fetch(params.url);
    if(typeof params.dataType !== 'undefined' && params.dataType === 'xml')
    {
        const parser = new xml2js.Parser();
        const xml = await resp.text();
        const json = await parser.parseStringPromise(xml);
        if(typeof json === 'object')
        {
            if(typeof params.callback !== 'undefined')
            {
                params.callback(json);
            }
            return json;
        }
    }
    else
    {
        const body = await resp.json();
        if(typeof body !== 'undefined' && body.status === 'OK')
        {
            if(typeof params.callback !== 'undefined')
            {
                params.callback(body.results);
            }
            return body.results;
        }
    }
    return null;
};

export default fetchData;