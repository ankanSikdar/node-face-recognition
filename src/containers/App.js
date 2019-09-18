import React, { Component } from 'react';
import './App.css';
import Navigation from '../components/Navigation/Navigation'
import Logo from '../components/Logo/Logo'
import ImageLinkForm from '../components/ImageLinkForm/ImageLinkForm'
import Rank from '../components/Rank/Rank';
import FaceRecognition from '../components/FaceRecognition/FaceRecognition'
import Signin from '../components/Signin/Signin'
import Register from '../components/Register/Register'
import Particles from 'react-particles-js';


class App extends Component {
  constructor() {
    super()
    this.state = {
      input: "",
      imgUrl: "",
      boxes: [],
      route: "signin",
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: ''
      }
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined
      }
    })
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value})
  };

  onButtonSubmit = () => {
    this.setState({imgUrl: this.state.input});
  }

  calculateFaceLocations = (data) => {
    let image = document.getElementById('inputimage')
    let height = Number(image.height)
    let width = Number(image.width)
    let clarifaiFaces = data.outputs[0].data.regions //region_info.bounding_box
    let result = []
    clarifaiFaces.forEach(face => {
      let boxDim = face.region_info.bounding_box
      result.push( {
        leftCol: boxDim.left_col * width,
        topRow: boxDim.top_row * height,
        rightCol: width - (boxDim.right_col * width),
        bottomRow: height - (boxDim.bottom_row * height)
      })
    })
      
    return result
  }

  displayFaceBoxes = (boxes) => {
    this.setState({boxes: boxes})
  }

  /*
    setState() does not immediately mutate this.state but creates a pending state transition. 
    Accessing this.state after calling this method can potentially return the existing value. 
    There is no guarantee of synchronous operation of calls to setState and calls may be batched 
    for performance gains.
    That is why react docs tells us to use componentDidUpdate
  */
  componentDidUpdate(prevProps, prevState) {
    if(this.state.imgUrl !== prevState.imgUrl) {
      fetch("http://immense-beyond-32423.herokuapp.com/imageurl", {
        method: "post",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(
          {
            input: this.state.imgUrl
          }
        )
      }).then(response => response.json())
        .then(data => this.displayFaceBoxes(this.calculateFaceLocations(data)))
        .catch(err => console.log(err));

        fetch("http://immense-beyond-32423.herokuapp.com/image", {
          method: "put",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify(
              {
                  id: this.state.user.id
              }
          )
          })
          .then(response => response.json())
          .then(count => {
              this.setState(Object.assign(this.state.user,{ entries: count }))
          })
          .catch(err => console.log(err))
    }
  }

  onRouteChange = (route) => {
      this.setState({route: route})
  }

  render() {
    let { imgUrl, boxes, route } = this.state
    if(route === "home") {
      return (
        <div className="App"> 
          <Particles className="particles" params={particlesOptions} />
          <Navigation onRouteChange={this.onRouteChange}/>
          <Logo/>
          <Rank name={this.state.user.name} entries={this.state.user.entries}/>
          <ImageLinkForm onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
          <FaceRecognition imgUrl={imgUrl} boxes={boxes}/>
        </div>
      )
    } else if (route === "signin") {
      return(
        <div className="App">
          <Particles className="particles" params={particlesOptions} />
          <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>  
        </div>
      )
    } else {
      return (
        <div className="App">
          <Particles className="particles" params={particlesOptions} />
          <Register onRouteChange={this.onRouteChange} loadUser={this.loadUser}/>
        </div>
      )
    }
  }
}

const particlesOptions = {
  particles: {
    "number": {
      "value": 150,
      "density": {
        "enable": true,
        "value_area": 800
      }
    }
  } 
}


export default App;
