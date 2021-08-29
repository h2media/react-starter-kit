import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import fetchData from "../../utils/fetchData";
import { API_URL, API_KEY } from "../../constants";

export const fetchTopStories = createAsyncThunk('home/fetchTopStories', async () => {
    try{
        const data = await fetchData({
            'url' : `${API_URL}topstories/v2/home.json?api-key=${API_KEY}`
        });
        return data.slice(0, 5);
    } catch(error) {
        throw error;
    }
})

export const fetchMostPopular = createAsyncThunk('home/fetchMostPopular', async (ruleType, thunkAPI) => {
    const cached = thunkAPI.getState().home.mostPopular[ruleType]
    if (cached.length > 0) {
        return {
            'data' : cached,
            'rule' : ruleType
        }
    }
    try{
        const res = await fetchData({
            'url' : `${API_URL}mostpopular/v2/${ruleType}?api-key=${API_KEY}`
        });
        return {
            'data' : res,
            'rule' : ruleType
        }
    } catch(error) {
        throw error;
    }
}
// , {
//     condition: (ruleType, { getState, extra }) => {
//         const { state } = getState()
//         const fetched = state.mostPopular[ruleType]
//         if (fetched.length > 0) {
//             return false;
//         }
//     }
// }
)

export const homeSlice = createSlice({
    name: 'home',
    initialState: {
        mostPopularRule: '/viewed/7.json',
        topStories: [],
        topStoriesStatus: 'idle',
        topStoriesError: null,
        mostPopular: {
            '/viewed/7.json' : [],
            '/emailed/1.json' : [],
            '/shared/1/facebook.json' : []
        },
        mostPopularStatus: 'idle',
        mostPopularError: null,
    },
    reducers: {
        setMostPopularRule: {
            reducer: (state, action) => {
                state.mostPopularRule = action.payload.value
            },
            prepare(value) {
                return {
                    payload: {
                        key: nanoid(),
                        value: value,
                    },
                }
            },
        }
    },
    extraReducers: {
        [fetchTopStories.pending]: (state, action) => {
            state.topStoriesStatus = 'loading'
        },
        [fetchTopStories.fulfilled]: (state, action) => {
            state.topStoriesStatus = 'succeeded'
            state.topStories = action.payload
        },
        [fetchTopStories.rejected]: (state, action) => {
            state.topStoriesStatus = 'failed'
            state.topStoriesError = action.error.message
        },
        [fetchMostPopular.pending]: (state, action) => {
            state.mostPopularStatus = 'loading'
        },
        [fetchMostPopular.fulfilled]: (state, action) => {
            state.mostPopularStatus = 'succeeded'
            state.mostPopular[action.payload.rule] = action.payload.data
        },
        [fetchMostPopular.rejected]: (state, action) => {
            state.mostPopularStatus = 'failed'
            state.mostPopularError = action.error.message
        },
    },
})

export const { setMostPopularRule } = homeSlice.actions

export default homeSlice.reducer