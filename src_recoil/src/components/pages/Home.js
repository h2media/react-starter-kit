import React, { useCallback, useMemo } from "react";
import { useRecoilValue, useRecoilState } from "recoil";
import { format } from 'date-fns';
import { topStoriesSelector as topStories, mostPopularSelector as mostPopular } from "../../recoil/Selectors";
import { mostPopularRuleAtoms as mostPopularRule } from "../../recoil/Atoms";
import makeUrl from  "../../utils/makeUrl";

const Home = props => {
    console.log(props);
    const itemTopStories = useRecoilValue(topStories);
    const itemTopStoriesMemo = useMemo(() => {
        const id = [];
        for(const value of itemTopStories)
        {
            id.push(value.url);
        }
        return id;
    }, [itemTopStories]);
    const [mostPopularData, setMostPopularData] = useRecoilState(mostPopularRule);
    const itemMostPopular = useRecoilValue(mostPopular(mostPopularData));
    const itemMostPopularMemo = useMemo(() => {
        const id = [];
        for(const value of itemMostPopular)
        {
            id.push(value.url);
        }
        return id;
    }, [itemMostPopular]);
    const onItemClick = useCallback((event) => {
        setMostPopularData(event.target.getAttribute('id'));
    }, [setMostPopularData]);
    return (
        <React.Fragment>
            <HeroBanner articles={itemTopStories} ids={itemTopStoriesMemo} />
            <div className="row">
                <Stream articles={itemMostPopular} ids={itemMostPopularMemo} buttonState={mostPopularData} onItemClick={onItemClick} />
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
                        name: item.title
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
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.ids) === JSON.stringify(nextProps.ids);
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
                                name: 'Continue reading...'
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
                                name: props.item.title
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