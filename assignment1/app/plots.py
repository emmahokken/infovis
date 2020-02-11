from bokeh.plotting import figure, ColumnDataSource
from bokeh.layouts import row, column, widgetbox
from bokeh.models import HoverTool, Slider, CustomJS
from bokeh.embed import json_item
from bokeh.palettes import Category20c, Plasma
from bokeh.transform import cumsum, linear_cmap
from bokeh.events import DoubleTap


from . import data
import numpy as np

def create_scatter(area, plot_data, y_variables=data.model_vars, y_definition=data.label_def_ordered,
					y_extra_info=data.label_extra_ordered, div_name="myplot"):

	values = plot_data.to_numpy()

	values = values[0]

	all_data = ColumnDataSource(data=dict({'variables': y_variables,
				'values': values,
				'definition': y_definition,
				'variables_extra': y_extra_info}))

	tooltips = """
	<div style="width:200px;">
			<div>
                <span style="font-size: 15px; color:blue">Variable:</span>
                <span style="font-size: 12px;">@variables_extra</span>
            </div>
            <div>
                <span style="font-size: 15px; color:blue">Percentage:</span>
                <span style="font-size: 12px;">@values{1.1} %</span>
            </div>
            <div>
                <span style="font-size: 15px; color:blue">Explanation:</span>
                <span style="font-size: 12px;">@definition</span>
            </div>
        </div>
	"""

	TOOLS = "hover,save,pan,box_zoom,reset,wheel_zoom,tap"
	# plot = figure(plot_height = 600, plot_width = 800, tools=TOOLS, tooltips=tooltips)

	# all_data.data['angle'] = all_data.data['values'] / all_data.data['values'].sum() * 2*np.pi
	all_data.data['colour'] = Category20c[len(all_data.data['values'])]

	# plot.wedge(x=0, y=1, radius=0.4,
    #     # use cumsum to cumulatively sum the values for start and end angles
    #     start_angle=cumsum('angle', include_zero=True), end_angle=cumsum('angle'),
    #     line_color="white", fill_color='color', fill_alpha=1, hover_fill_alpha=0.4, hover_fill_color='color', source=all_data)
	plot = figure(plot_height = 600, plot_width = 800,
	          x_axis_label = 'Percentage',
	           #y_axis_label = ,
	           x_range=(0,100), y_range=y_variables, tools=TOOLS, tooltips=tooltips)


	# plot.hbar(left='values', y='variables', right=1, height=0.9, fill_color='red', line_color='black', fill_alpha = 0.75,
	#         hover_fill_alpha = 1.0, hover_fill_color = 'navy', source=all_data)

	plot.circle(x='values', y='variables', source=all_data, size=15,
				fill_color='colour')
				# fill_color=linear_cmap('values', 'Viridis256', 0, max(all_data.data['values'])))

	plot.title.text = "Relevant statistics about " + area

	part_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WPARTHUUR_P'].iloc[0], step=1, title="Private rental", bar_color=all_data.data['colour'][9])
	corp_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WCORHUUR_P'].iloc[0], step=1, title="Housing corporation rental", bar_color=all_data.data['colour'][8])
	high_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WHUURHOOG_P'].iloc[0], step=1, title="High rent (> 971 euro)", bar_color=all_data.data['colour'][7])
	middle_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WHUURMIDDEN_P'].iloc[0], step=1, title="Middle high rent (711 - 971 euro)", bar_color=all_data.data['colour'][6])
	low_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WHUURTSLG_P'].iloc[0], step=1, title="Low rent (< 711 euro)", bar_color=all_data.data['colour'][5])
	living_space_040 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP0040_P'].iloc[0], step=1, title="Living space of 0-40 m2", bar_color=all_data.data['colour'][0])
	living_space_4060 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP4060_P'].iloc[0], step=1, title="Living space of 40-60 m2", bar_color=all_data.data['colour'][1])
	living_space_6080 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP6080_P'].iloc[0], step=1, title="Living space of 60-80 m2", bar_color=all_data.data['colour'][2])
	living_space_80100 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP80100_P'].iloc[0], step=1, title="Living space of 80-100 m2", bar_color=all_data.data['colour'][3])
	living_space_100 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP100PLUS_P'].iloc[0], step=1, title="Living space of > 100 m2", bar_color=all_data.data['colour'][4])

	all_sliders = [part_rent_slider, corp_rent_slider, high_rent_slider,middle_rent_slider, low_rent_slider,
	living_space_100, living_space_80100, living_space_6080, living_space_4060, living_space_040]

	slider_callback = CustomJS(args=dict(source=all_data), code="""
		var data = source.data;
		var values = data["values"];

		var value = cb_obj.value;
		var var_text = cb_obj.title;

        var variable;
		var value_idx;
		updatePlot(value, var_text);
        socket.on('plot_update', function(msg) {
            value = msg.new_value;
            variable = msg.variable;
			value_idx = msg.index;

			values[value_idx] = value;
			data.values = values;
			source.data = data;
			source.change.emit();

			window.onmouseup = function() {
				updateModel(value, variable);
			}
        });
	""")

	double_click_callback = CustomJS(args=dict(source=all_data), code="""
		alert('you clicked twice!');
	""")

	for slider in all_sliders:
		slider.js_on_change('value', slider_callback)

	plot.js_on_event(DoubleTap, double_click_callback)

	layout = row(
	    plot,
	    column(*all_sliders),
		width=800
	)

	plot_json = json_item(layout, div_name)

	return plot_json



def create_hbar(area, plot_data, y_variables=data.model_vars, y_definition=data.label_def_ordered,
y_extra_info=data.label_extra_ordered, div_name="myplot"):
	values = plot_data.to_numpy()
	values = values[0]
	all_data = ColumnDataSource(data=dict({'variables': y_variables,
				'values': values,
				'definition': y_definition,
				'variables_extra': y_extra_info}))


	tooltips = """
	<div style="width:200px;">
			<div>
                <span style="font-size: 15px; color:blue">Variable:</span>
                <span style="font-size: 12px;">@variables_extra</span>
            </div>
            <div>
                <span style="font-size: 15px; color:blue">Percentage:</span>
                <span style="font-size: 12px;">@values{1.1} %</span>
            </div>
            <div>
                <span style="font-size: 15px; color:blue">Explanation:</span>
                <span style="font-size: 12px;">@definition</span>
            </div>
        </div>
	"""

	TOOLS = "hover,save,pan,box_zoom,reset,wheel_zoom"
	plot = figure(plot_height = 600, plot_width = 800,
	          x_axis_label = 'Percentage',
	           #y_axis_label = ,
	           x_range=(0,100), y_range=y_variables, tools=TOOLS, tooltips=tooltips)

	plot.hbar(left='values', y='variables', right=1, height=0.9, fill_color='red', line_color='black', fill_alpha = 0.75,
	        hover_fill_alpha = 1.0, hover_fill_color = 'navy', source=all_data)

	plot.title.text = "Relevant statistics about " + area

	part_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WPARTHUUR_P'].iloc[0], step=1, title="Private rental")
	corp_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WCORHUUR_P'].iloc[0], step=1, title="Housing corporation rental")
	high_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WHUURHOOG_P'].iloc[0], step=1, title="High rent (> 971 euro)")
	middle_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WHUURMIDDEN_P'].iloc[0], step=1, title="Middle high rent (711 - 971 euro)")
	low_rent_slider = Slider(start=0, end=100, value=plot_data.loc[:, 'WHUURTSLG_P'].iloc[0], step=1, title="Low rent (< 711 euro)")
	living_space_040 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP0040_P'].iloc[0], step=1, title="Living space of 0-40 m2")
	living_space_4060 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP4060_P'].iloc[0], step=1, title="Living space of 40-60 m2")
	living_space_6080 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP6080_P'].iloc[0], step=1, title="Living space of 60-80 m2")
	living_space_80100 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP80100_P'].iloc[0], step=1, title="Living space of 80-100 m2")
	living_space_100 = Slider(start=0, end=100, value=plot_data.loc[:, 'WOPP100PLUS_P'].iloc[0], step=1, title="Living space of > 100 m2")

	all_sliders = [part_rent_slider, corp_rent_slider, high_rent_slider,middle_rent_slider, low_rent_slider,
	living_space_100, living_space_80100, living_space_6080, living_space_4060, living_space_040]

	callback = CustomJS(args=dict(source=all_data), code="""
		var data = source.data;
		var values = data["values"];

		var value = cb_obj.value;
		var var_text = cb_obj.title;

        var variable;
		var value_idx;
		updatePlot(value, var_text);
        socket.on('plot_update', function(msg) {
            value = msg.new_value;
            variable = msg.variable;
			value_idx = msg.index;

			values[value_idx] = value;
			data.values = values;
			source.data = data;
			source.change.emit();

			window.onmouseup = function() {
				updateModel(value, variable);
			}
        });
	""")

	for slider in all_sliders:
		slider.js_on_change('value', callback)

	layout = row(
	    plot,
	    column(*all_sliders),
		width=800
	)

	plot_json = json_item(layout, div_name)

	return plot_json
