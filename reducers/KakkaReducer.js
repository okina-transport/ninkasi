import * as types from './../actions/actionTypes'

const KakkaReducer = (state = {}, action) => {

    switch(action.type) {

        case types.REQUEST_EXPORT_STOP_PLACES_ALL_PROVIDERS:
            return Object.assign({}, state, {isLoading: true, error: false })

        case types.REQUEST_EXPORT_STOP_PLACES_ONE_PROVIDER:
            return Object.assign({}, state, {isLoading: true, error: false })

        case types.SUCCESS_EXPORT_STOP_PLACES_ALL_PROVIDERS:
            return Object.assign({}, state, {isLoading: false, export_stop_places_all_providers: action.payLoad, error: false })

        case types.ERROR_EXPORT_STOP_PLACES_ALL_PROVIDERS:
            return Object.assign({}, state, {isLoading: false, export_stop_places_all_providers: action.payLoad, error: true})

        case types.SUCCESS_EXPORT_STOP_PLACES_ONE_PROVIDER:
            return Object.assign({}, state, {isLoading: false, export_stop_places_one_provider: action.payLoad, error: false })

        case types.ERROR_EXPORT_STOP_PLACES_ONE_PROVIDER:
            return Object.assign({}, state, {isLoading: false, export_stop_places_one_provider: action.payLoad, error: true})

        default:
            return state
    }
}

export default KakkaReducer
