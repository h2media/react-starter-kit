import React, { Fragment, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import makeUrl from  "../../utils/makeUrl";
import { format } from 'date-fns';
import { fetchSectionData, setSectionName } from '../../redux/slices/sectionSlice';

const Section = React.memo(props => {
    const { slug } = useParams();
	const dispatch = useDispatch();
	useEffect(() => {
		dispatch(setSectionName(slug));
		dispatch(fetchSectionData(slug));
	}, [slug, dispatch]);
	const data = useSelector(state => state.section);
	const articles = data.sectionData[slug] || [];
	if(typeof articles.rss !== 'undefined')
	{
		return (
			<Stream section={slug} articles={articles.rss.channel[0].item} />
		);
	}
	else
	{
		return null
	}
}, (prevProps, nextProps) => {
    return prevProps.match.params.slug === nextProps.match.params.slug;
})

const Stream = React.memo(({section, articles}) => {
    if(articles.length === 0)
    {
        return (
            <div className="col-md-12 blog-main">
                <h3 className="pb-3 mb-4 border-bottom text-capitalize">{section} - No Result Not Found</h3>
            </div>
        );
    }
    return (
        <Fragment>
            <div className="blog-main">
                <h3 className="pb-3 mb-4 border-bottom text-capitalize">{section}</h3>
            </div>
            <div className="blog-main row">
                {
                    articles.map((item) => {
                        const shareURL = makeUrl({
                            className: 'text-dark font-weight-bold',
                            to: item.link[0],
                            type: 'article',
                            name: item.title[0],
							target: '_blank',
							rel: 'noopener noreferrer nofollow'
                        });
                        let thumb = 'https://dummyimage.com/151x151/CCC.jpg&text=No+Thumbnail';
                        try {
                            thumb = item["media:content"][0].$.url;
                        } catch(e) {

                        }
                        return (
                            <div className="col-md-6 col-12 mb-2 row" key={item.link[0]}>
                                <div className="col-md-3 col-5">
                                    <img className="img-fluid" alt={item.link[0]} src={thumb} />
                                </div>
                                <div className="col-md-9 col-7">
                                    <h5>{shareURL}</h5>
                                    <p className="blog-post-meta">
                                        {format(new Date(item.pubDate[0]), 'HH:ii, dd/MM')} 
                                    </p>
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </Fragment>
    );
})

export default Section;