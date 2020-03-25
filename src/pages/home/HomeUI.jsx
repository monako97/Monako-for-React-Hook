import React from "react";
import HomeStyle from "./home-container.scss";
import {AutoSizer, InfiniteLoader, List} from "react-virtualized";
export default ({list, isRowLoaded, onRowsRendered, rowHeight, rowRenderer}) => {
    return (<main className={HomeStyle.home_container}>
        <InfiniteLoader
            isRowLoaded={({ index }) => isRowLoaded({ index })}
            rowCount={list.length}
            loadMoreRows={()=>{}}>
            {() => (
                <AutoSizer>
                    {({width,height}) => (
                        <List width={width}
                              height={height}
                              onRowsRendered={({ startIndex, stopIndex }) => onRowsRendered({ startIndex, stopIndex })}
                              rowCount={list.length}
                              rowHeight={rowHeight}
                              rowRenderer={rowRenderer}
                              style={{ outline: "none" }} />
                    )}
                </AutoSizer>
            )}
        </InfiniteLoader>
    </main>);
};
