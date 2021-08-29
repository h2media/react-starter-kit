import React, { Fragment, useCallback, useEffect, useMemo, useState } from "react";
import { useRecoilValue, useRecoilState, atom, selectorFamily, useRecoilCallback  } from "recoil";
import { useParams } from "react-router-dom";
import { sectionSelector } from "../../recoil/Selectors";
import { sectionAtoms }  from "../../recoil/Atoms";
import makeUrl from  "../../utils/makeUrl";
import { format } from 'date-fns';

const Section = React.memo(props => {
    const { slug } = useParams();
    const articles = useRecoilValue(sectionSelector(slug));
    const [prevArticles, setPrevArticles] = useRecoilState(sectionAtoms);
    useEffect(() => {
        const nextArticle = {
            ...prevArticles,
            [slug] : articles,
        }
        setPrevArticles(nextArticle);
    }, [slug]);
    const ids = useMemo(() => {
        const id = [];
        for(const value of articles)
        {
            id.push(value.link[0]);
        }
        return id;
    }, [slug]);
    return (
        <Stream section={slug} articles={articles} ids={ids} />
    );
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
                            name: item.title[0]
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
}, (prevProps, nextProps) => {
    return JSON.stringify(prevProps.ids) === JSON.stringify(nextProps.ids);
})

export default Section;