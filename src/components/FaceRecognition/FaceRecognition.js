import React from 'react';
import './FaceRecognition.css'

const FaceRecognition = ({imgUrl, boxes}) => {
    let boxesArray = boxes.map(box=> {
        return (
            <div key={box.topRow + box.rightCol + box.bottomRow + box.leftCol} className="bounding-box" style={{
                top: box.topRow,
                right: box.rightCol,
                bottom: box.bottomRow,
                left: box.leftCol,
            }}> </div>
        )
    })

    if(imgUrl.length > 0) {
        return (
            <div className="center ma">
                <div className="absolute mt2">
                    <img id="inputimage" alt="face recognition" width="500px" height="auto" src={imgUrl} />
                        {boxesArray}
                </div>
            </div>
        )
    } else {
        return (
            <div className="center pa2">
                <p>No url provided!</p>
            </div>
        )
    }
    
}


export default FaceRecognition;