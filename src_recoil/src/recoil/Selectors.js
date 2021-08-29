import { selector, selectorFamily, useRecoilState } from 'recoil'
import fetchData from "../utils/fetchData";
import { API_URL, API_KEY } from "../constants";

export const topStoriesSelector = selector({
    key: '_selector_top_stories',
    get: async () => {
        try{
            const data = await fetchData({
                'url' : `${API_URL}topstories/v2/home.json?api-key=${API_KEY}`
            });
            return data.slice(0, 5);
        } catch(error) {
            throw error;
        }
    }
});

export const mostPopularSelector = selectorFamily({
    key: '_selector_most_popular',
    get: ruleType => async () => {
        return await fetchData({
            'url' : `${API_URL}mostpopular/v2/${ruleType}?api-key=${API_KEY}`
        });
    }
});

export const sectionSelector = selectorFamily({
    key: '_selector_section',
    get: sectionName => async (props) => {
        let items = [];
        try {
            const res = await fetchData({
                'url' : `https://rss.nytimes.com/services/xml/rss/nyt/${sectionName}.xml`,
                'dataType': 'xml'
            });
            items = res.rss.channel[0].item;
        } catch(e) {
            console.log(e);
        }
        return items;
    }
});

