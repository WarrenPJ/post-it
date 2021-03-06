var Note = React.createClass({
	displayName: 'Note',

	getInitialState: function () {
		return { editing: false };
	},
	componentWillMount: function () {
		this.style = {
			right: this.randomBetwen(0, window.innerWidth - 150) + 'px',
			top: this.randomBetwen(0, window.innerHeight - 150) + 'px',
			transform: 'rotate(' + this.randomBetwen(-15, 15) + 'deg)'
		};
	},
	componentDidMount: function () {
		$(this.getDOMNode()).draggable();
	},
	randomBetwen: function (min, max) {
		return min + Math.ceil(Math.random() * max);
	},
	edit: function () {
		this.setState({ editing: true });
	},
	save: function () {
		this.props.onChange(this.refs.newNote.getDOMNode().value, this.props.index);
		this.setState({ editing: false });
	},
	remove: function () {
		this.props.onRemove(this.props.index);
	},
	renderDisplay: function () {
		return React.createElement(
			'div',
			//Edit on click
			{ onClick: this.edit, className: 'note', style: this.style },
			React.createElement(
				'p',
				null,
				this.props.children
			),
			React.createElement(
				'span',
				null,
				React.createElement('button', { onClick: this.edit, className: 'btn btn-primary glyphicon glyphicon-pencil' }),
				React.createElement('button', { onClick: this.remove, className: 'btn btn-danger glyphicon glyphicon-trash' })
			)
		);
	},
	handleTest: function(e) {
        if (e.keyCode == 13 && e.shiftKey) {
		  return true;
        }
		else if (e.keyCode == 13) {
		  // Save function
          this.props.onChange(this.refs.newNote.getDOMNode().value, this.props.index);
		  this.setState({ editing: false });
		}
	},
	// Move cursor to end of note
	moveCaretAtEnd(e) {
	    var temp_value = e.target.value
	    e.target.value = ''
	    e.target.value = temp_value
	},
	renderForm: function () {
		return React.createElement(
			'div',
			{ className: 'note', style: this.style },
			React.createElement('textarea', { ref: 'newNote', defaultValue: this.props.children, className: 'form-control', autoFocus: true, onFocus: this.moveCaretAtEnd, onKeyDown: this.handleTest }),
			React.createElement('button', { onClick: this.save, className: 'btn btn-success btn-sm glyphicon glyphicon-ok' })
		);
	},
	render: function () {
		if (this.state.editing) {
			return this.renderForm();
		} else {
			return this.renderDisplay();
		}
	}
});

var Board = React.createClass({
	displayName: 'Board',

	protoTypes: {
		count: function (props, propName) {
			if (typeof props[propName] !== "number") {
				return new Error('The count prop must be a number');
			}
			if (props[propName] > 100) {
				return new Error('Creating' + props[propName] + ' notes is ridiculous!');
			}
		}
	},
	getInitialState: function () {
		return {
			notes: []
		};
	},
	nextId: function () {
		this.uniqueId = this.uniqueId || 0;
		return this.uniqueId++;
	},
	/*componentWillMount: function() {
 	var self = this;
 	if(this.props.count) {
 		$.getJSON("http://baconipsum.com/api/?type=all-meat&sentences=" + 
 			this.props.count + "&start-with-lorem=1&callback=?", function(results){
 				results[0].split('. ').forEach(function(sentence){
 					self.add(sentence.substring(0,40));
 				});
 			});
 	}
 }, */
	add: function (text) {
		var arr = this.state.notes;
		arr.push({
			id: this.nextId(),
			note: text
		});
		this.setState({ notes: arr });
	},
	update: function (newNote, i) {
		var arr = this.state.notes;
		arr[i].note = newNote;
		this.setState({ notes: arr });
	},
	remove: function (i) {
		var arr = this.state.notes;
		arr.splice(i, 1);
		this.setState({ notes: arr });
	},
	eachNote: function (note, i) {
		return React.createElement(
			Note,
			{ key: note.id,
				index: i,
				onChange: this.update,
				onRemove: this.remove
			},
			note.note
		);
	},
	render: function () {
		return React.createElement(
			'div',
			{ className: 'board' },
			this.state.notes.map(this.eachNote),
			React.createElement('button', { className: 'btn btn-success btn-sm glyphicon glyphicon-plus', onClick: this.add.bind(null, "") })
		);
	}
});

React.render(React.createElement(Board, { count: 10 }), document.getElementById('react-container'));