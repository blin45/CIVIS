import React, { useEffect } from 'react'
import { Card, CardContent } from '@material-ui/core';



const Search = ({setMapCenter}) => {

    // onClick = {setCenter(value)}
    // initialize search result
    const [searchResults, setSearchResult] = React.useState(null);

    //if you have more than one datasets, you can use the following code to add more datasets
    // const [data, setData] = React.useState([])
    const [lines,setlines] = React.useState(null);
    var searchResult=[];
    function searchItem(item){
        //I'll clean this up later
        searchResult=[];
        if(item.length>5){
          console.log(lines);
          let temp_line = lines.features.filter(f=>f.properties.Name.toLowerCase().includes(item.toLowerCase()));
          for(let i =0;i<temp_line.length;i++){
            searchResult.push(temp_line[i]);
          }
          console.log(searchResult);
                  
        }

        //limit the search result to 8 items
        if(searchResult.length>8){
            searchResult.length=8;
            }
        setSearchResult(searchResult);
      }

    // Fetching infrastucture or other data using the following code
    useEffect(() => {

        const fetchLinedata = async () => {
            try {
                //replace the url with your own data source if needed
                let response = await fetch('../data/Knn_result.json');
                let responseJson = await response.json();
                setlines(responseJson);
                console.log("Reading Line complete");
                } catch(error) {
                console.error(error);
            }
        }
        fetchLinedata();
      },[]);
    return (
        <div id = 'search' className='search-bar'>
            <input
            type="text"
            className="search-input"
            placeholder="Search for a location"
            onChange={(e) => searchItem(e.target.value)}
            />
            <div id='search-result'>
                {searchResults && searchResults.map((data,index) => {
                    return (
                        <div key={index}>
                        <Card className="card">
                            <CardContent>
                            <div className="card">
                                <div className="card-content">
                                    <div className="card-title">
                                    <h3>{data.properties.Name}</h3>
                                    <button className="btn-small" key={index} onClick = {()=>setMapCenter(data.geometry.coordinates)}>View</button>
                                    </div>
                                </div>
                            </div>
                            </CardContent>
                        </Card>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Search