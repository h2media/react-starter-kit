import React, { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { format } from 'date-fns';
import { setMostPopularRule, fetchTopStories, fetchMostPopular } from '../../redux/slices/homeSlice';
import makeUrl from  "../../utils/makeUrl";
import Loading from  "../../components/common/Loading";

// const Home = _ => {
// 	const dispatch = useDispatch();
//  	const data = useSelector(state => state.home);
// 	 useEffect(() => {
// 		dispatch(fetchMostPopular(data.mostPopularRule));
// 	}, [data.mostPopularRule]);
// 	return 21313;
// }

const Home = props => {
	const dispatch = useDispatch();
	const data = useSelector(state => state.home);

	useEffect(() => {
		if (data.topStoriesStatus === 'idle') {
			dispatch(fetchTopStories());
		}
	}, [data.topStoriesStatus, dispatch]);

	useEffect(() => {
		dispatch(fetchMostPopular(data.mostPopularRule));
	}, [data.mostPopularRule, dispatch]);

	// const topStoriesID = useMemo(() => {
    //     const id = [];
    //     for(const value of data.topStories)
    //     {
    //         id.push(value.url);
    //     }
    //     return id;
    // }, [data.topStories]);

	const onItemClick = useCallback((e) => {
		dispatch(setMostPopularRule(e.target.getAttribute('id')));
	}, [dispatch]);

	return (
		<React.Fragment>
			{(typeof data.topStories !== 'undefined' && data.topStories.length > 0) ? 
			<HeroBanner articles={data.topStories} /> : <Loading /> }
			<div className="row">
				{(typeof data.mostPopular[data.mostPopularRule] !== 'undefined' && data.mostPopular[data.mostPopularRule].length > 0) ? <Stream articles={data.mostPopular[data.mostPopularRule]} buttonState={data.mostPopularRule} onItemClick={onItemClick} /> : <Loading /> }
			</div>
		</React.Fragment>
	);
}

const Stream = React.memo(props => {
    console.log('Stream');
    return (
        <div className="col-md-12 blog-main row">
            <h3 className="pb-3 mb-4 border-bottom row col-md-12">
                <button id="/viewed/7.json" className={(props.buttonState === '/viewed/7.json') ? "btn btn-outline-primary mx-2 active" : "btn btn-outline-primary mx-2"} onClick={props.onItemClick}>Views</button>
                <button id="/emailed/1.json" className={(props.buttonState === '/emailed/1.json') ? "btn btn-outline-success mx-2 active" : "btn btn-outline-success mx-2"} onClick={props.onItemClick}>Emailed</button>
                <button id="/shared/1/facebook.json" className={(props.buttonState === '/shared/1/facebook.json') ? "btn btn-outline-info mx-2 active" : "btn btn-outline-info mx-2"} onClick={props.onItemClick}>Share</button>
            </h3>
            {
                props.articles.map((item, index) => {
                    const shareURL = makeUrl({
                        className: 'text-dark font-weight-bold',
                        to: item.url,
                        type: 'article',
                        name: item.title,
						target: '_blank',
						rel: 'noopener noreferrer nofollow'
                    });
                    const sectionURL = makeUrl({
                        typeLink: 'NavLink',
                        to: item.section,
                        type: 'section',
                        name: item.section
                    });
                    let thumb = 'https://dummyimage.com/440x293/CCC.jpg&text=No+Thumbnail';
                    try {
                        thumb = item.media[0]["media-metadata"][2].url;
                    } catch(e) {

                    }
                    return (
                        <div className="row mb-3 col-md-6 col-12" key={item.id}>
                            <div className="col-md-4 d-none d-lg-block">
                                <img className="img-fluid" alt={item.id} src={thumb} />
                            </div>
                            <div className="col-md-8 col-12">
                                <h6>{shareURL}</h6>
                                <p className="blog-post-meta">
                                    {format(new Date(item.published_date), 'HH:ii, dd/MM')} 
                                    {' - '} 
                                    {sectionURL}
                                </p>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    );
})

const HeroItem = React.memo(props => {
    if(props.index === 0)
    {
        return (
            <div className="jumbotron p-2 p-md-5 text-white rounded bg-dark row mx-0 col-md-12">
                <div className="col-md-3 px-0">
                    <img className="card-img-right flex-auto d-none d-md-block" src={props.item.multimedia[2].url} alt={props.item.multimedia[2].caption} />
                </div>
                <div className="col-md-9 px-0">
                    <h3 className="display-5 font-italic">
                        {props.item.title}
                    </h3>
                    <p className="lead my-3">
                        {props.item.abstract}
                    </p>
                    <p className="lead mb-0">
                        {
                            makeUrl({
                                className: 'text-white font-weight-bold',
                                to: props.item.short_url,
                                type: 'article',
                                name: 'Continue reading...',
								target: '_blank',
								rel: 'noopener noreferrer nofollow'
                            })
                        }
                    </p>
                </div>
            </div>
        );
    }
    else
    {
        return (
            <div className="col-md-6 row py-2 mx-0">
                <div className="col-md-7 col-8 px-1 mx-0">
                    {
                        makeUrl({
                            typeLink: 'Link',
                            className: 'd-inline-block mb-2 text-primary text-capitalize font-weight-bold',
                            to: props.item.section,
                            type: 'section',
                            name: props.item.section
                        })
                    }
                    <h5 className="mb-0">
                        {
                            makeUrl({
                                className: 'text-dark',
                                to: props.item.short_url,
                                type: 'article',
                                name: props.item.title,
								target: '_blank',
								rel: 'noopener noreferrer nofollow'
                            })
                        }
                    </h5>
                    <div className="mt-3 text-muted">{format(new Date(props.item.published_date), 'HH:ii, dd/MM')}</div>
                </div>
                <div className="col-md-5 col-4 d-flex justify-content-end px-0">
                    <img className="d-flex align-content-end flex-wrap img-thumbnail img-fluid" style={{ objectFit: 'cover' }} src={props.item.multimedia[2].url} alt={props.item.multimedia[2].caption} />
                </div>
            </div>
        );
    }
})

const HeroBanner = React.memo((props) => {
    console.log('HeroBanner');
    const items = props.articles;
    return (
        <React.Fragment>
            <div className="row mb-2">
            {
                items.map((item, index) => <HeroItem key={item.url} index={index} item={item} />)
            }
            </div>
        </React.Fragment>
    );
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.ids) === JSON.stringify(nextProps.ids);
})

export default Home;