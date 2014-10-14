/*** @jsx React.DOM */

var Charts = React.createClass({
  // calculates domain with given values
  calculateDomain: function(data, props) {
    return d3.extent(_(data).map().flatten().map(function(d) {
      return props.map(function(e) {
        return d[e];
      });
    }).flatten().value());
  },

  onBrush: function(extent) {
    this.setState({extent: extent}); // propagate extent to child components (downwards)
    this.props.setState({extent: extent}) // propagate extent to angular (upwards)
    // this.props.loadMoreData({extent: extent}); // tell angular to load more data
  },

  getInitialState: function() {
    return {
      xDomain: this.calculateDomain(this.props.sensors, ['ts']),
      yDomain: this.calculateDomain(this.props.sensors, ['x', 'y', 'z']),
    };
  },

  componentWillReceiveProps: function(nextProps) {
    this.setState({
      xDomain: this.calculateDomain(nextProps.sensors, ['ts']),
      yDomain: this.calculateDomain(nextProps.sensors, ['x', 'y', 'z']),
    });
  },

  render: function() {

    // don't draw charts for sensors without data
    this.props.sensors = _.omit(this.props.sensors, function(sensor) { return sensor.length == 0; });
    var charts = _.map(this.props.sensors, function(sensor, sensorName) {
      return (
        <div key={sensorName} className='pure-g'>
          <div className='pure-u-24-24'>
            <ChartHeader
              sensorName={sensorName}
              loadedData={sensor.length}
            />
            <ChartInfo
              sensorName={sensorName}
              loadedData={sensor.length}
            />
            <Chart
              data={sensor}
              extent={this.props.extent}
              xDomain={this.state.xDomain}
              yDomain={this.state.yDomain}
              onBrush={this.onBrush}
            />
          </div>
        </div>
      );
    }.bind(this))

    return (
      <div>{charts}</div>
    );
  }

});

