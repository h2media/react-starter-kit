import { configureStore } from '@reduxjs/toolkit'
import homeReducer from '../slices/homeSlice'
import sectionReducer from '../slices/sectionSlice'

export default configureStore({
	reducer: {
		home: homeReducer,
		section: sectionReducer,
	},
})
