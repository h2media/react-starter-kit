import { FOLDER } from "../../constants";
import makeUrl from  "../../utils/makeUrl";

const Header = _ => {
    return (
        <div className="container">
            <header className="blog-header py-3">
                <div className="row flex-nowrap justify-content-between align-items-center">
                    <div className="col-12 text-center">
                        {
                            makeUrl({
                                typeLink: 'Link',
                                to: '/',
                                className: 'blog-header-logo text-dark',
                                name: 'NYTimes'
                            })
                        }
                    </div>
                    
                </div>
            </header>
            <div className="nav-scroller py-1 mb-2">
                <nav className="nav d-flex justify-content-between">
                    {
                        FOLDER.map((item, index) => {
                            return makeUrl({
                                typeLink: 'NavLink',
                                key: item,
                                to: item,
                                activeClassName: 'font-weight-bold',
                                className: 'p-2 text-muted',
                                type: 'section',
                                name: item
                            })
                        })
                    }
                </nav>
            </div>
        </div>
    );
}

export default Header;