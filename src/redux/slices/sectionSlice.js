import { createSlice, nanoid, createAsyncThunk } from '@reduxjs/toolkit'
import fetchData from "../../utils/fetchData";

export const fetchSectionData = createAsyncThunk('section/fetchSectionData', async (sectionName, thunkAPI) => {
	const state = thunkAPI.getState().section;
    const cached = state.sectionData[sectionName] || []
    if (cached.length > 0) {
        return {
            'data' : cached,
            'section' : sectionName
        }
    }
    try{
        const res = await fetchData({
			'url' : `https://rss.nytimes.com/services/xml/rss/nyt/${sectionName}.xml`,
			'dataType': 'xml'
		});
        return {
            'data' : res,
            'section' : sectionName
        }
    } catch(error) {
        throw error;
    }
})

export const sectionSlice = createSlice({
    name: 'section',
    initialState: {
		sectionName: '',
		sectionData: {},
		sectionStatus: {},
		sectionError: {}
    },
	reducers: {
        setSectionName: {
            reducer: (state, action) => {
                state.sectionName = action.payload.value
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
		[fetchSectionData.pending]: (state, action) => {
			state.sectionStatus[state.sectionName] = 'loading'
		},
		[fetchSectionData.fulfilled]: (state, action) => {
			state.sectionStatus[state.sectionName] = 'succeeded'
			state.sectionData[state.sectionName] = action.payload.data
		},
		[fetchSectionData.rejected]: (state, action) => {
			state.sectionStatus[state.sectionName] = 'failed'
			state.sectionError[state.sectionName] = action.error.message
		},
    },
})

export const { setSectionName } = sectionSlice.actions

export default sectionSlice.reducer