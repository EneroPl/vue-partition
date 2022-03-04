# Notice
The component is under active development. If you found a bug/feature, I would be grateful if you create an issue for this <3

# Vue Partition
<a name="test"></a> 
Vue component (Vue 2 supported) representing:
<br>
<ul>
  <li>Visual representation of data in the form of sections (as disk space) with customization of each object;</li>
  <li>Flexible settings for data editing with flexible responsive customization of behavior properties.</li>
</ul>

# How to install & Usage
Now you can install package from npm only:

```javascript
// npm
npm i @eneropl/vue-partition
```

Once the package is installed, you can import it into your component:

```javascript
// template
 <VuePartition />

// script
import VuePartition from '@eneropl/vue-partition';
```

# Props
The component accepts 6 props (one of which is provided for the v-model property):

<table>
  <tr>
    <th>Name</th>
    <th>Type</th>
    <th>Default value/Required</th>
  </tr>
  <tr>
    <td>options</td>
    <td><code>Array</code></td>
    <td>required</td>
  </tr>
  <tr>
    <td>total</td>
    <td><code>Number | Null</code></td>
    <td>The sum of the value values in the options array</td>
  </tr>
  <tr>
    <td>step</td>
    <td><code>Number</code></td>
    <td>1</td>
  </tr>
  <tr>
    <td>disabled</td>
    <td><code>Boolean</code></td>
    <td>false</td>
  </tr>
  <tr>
    <td>min-value</td>
    <td><code>Number</code></td>
    <td>0</td>
  </tr>
  <tr>
    <td>max-value</td>
    <td><code>Number | Null</code></td>
    <td>null</td>
  </tr>
</table>

## Options<sup><code>Array</code></sup>
An array of data objects that you provide to display. 
A simple object that defines a technical view looks like this:

```javascript
{
  value: 100,
  minValue: 10,
  maxValue: 200,
  editable: true,
  editType: 'local',
  disabled: false,
  focused: false,
  settings: {},
}
```
The presented object properties, except for "settings", define the technical characteristics of a particular data object. Each array object can set its own configuration. More details about each property below:

### value<sup><code>Number</code> | required</sup>
Required property, the value of which is used for display/editing inside the component. If this property is not specified, then it is defined as 0.

UPD: Although you should not do this, otherwise you may have problems with the reactivity of your object, I guess.

### minValue<sup><code>Number</code> | default: 0</sup>
This property specifies the minimum allowed value that can be specified for the "value" property when editing your object. This component defines the global value "min-value", but if we specify this property in the object, then it will have a higher priority.

By default, this property is 0. This means that when editing a partition, the current section may disappear if its "value" when changed is <= 0.

### maxValue<sup><code>Number | Null</code> | default: null</sup>
A property that defines the maximum value that an element can only reach. If, while editing a partition, the current section reaches its maximum value, then it will stop being edited. Relative to the global "max-value" property defined for the partition component, that particular property will take precedence.

By default, this property is "null". This means that the object does not have a maximum limit.

### editable<sup><code>Boolean</code> | default: false</sup>
Specifies the state of an object that is available as editable. If the property is "true", then the object can change its "value" and affect other sections depending on the conditions set.

### editType<sup><code>String</code> | default: ''</sup>
A flag that only works with the "editable: true" property. If specified, then your editable object will only edit itself and the next (n + 1) section.

### disabled<sup><code>Boolean</code> | default: false</sup>
Specifies the state of the section. If a section is disabled ("disabled: true"), then no editing condition will affect this section, it will keep its "value" unchanged.

### focused<sup><code>Boolean</code> | default: false</sup>
Specifies the ability to set the default section as the section that will first accept changes to the main editable section. This means that wherever you define an editable object (even far, far away from the "focused: true" setting), it will first work on the focused section as long as its modifier conditions return "true".

### settings<sup><code>Object</code> | default: {}</sup>
An object that represents customization settings and has the following editing properties
(property values are provided as default values if you don't specify them).

Customization defines settings only for a specific object, but not for
all elements.
speak for themselves.

```javascript
{
      background: 'transparent',
      control: {
        background: '#FFFFFF',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent'
      },
      arrows: {
        size: 10,
        background: '#FFFFFF',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: 'transparent',
        prev: {
          background: '#FFFFFF',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'transparent'
        },
        next: {
          background: '#FFFFFF',
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: 'transparent'
        }
      }
    }
```

## Total<sup><code>Number | Null</code></sup>
The total value, which is defined as the sum of all "value" passed in "options". If the value is not specified, then the component will independently calculate the sum of all passed "value" in the array of "options" objects.

## Step<sup><code>Number</code></sup>
Specifying a value for this property will determine how many times your sections change. The default is 1, which means your changes to all sections will always be a multiple of 1 (will also work with any other integer values).

## Disabled<sup><code>Boolean</code></sup>
"true" value blocks the entire component.

## MinValue & MaxValue<sup><code>Number</code></sup>
Global setting of the minimum/maximum value for each section. Each section will comply with the set condition, except for those sections that do not define their own "minValue" and\or "maxValue" internally.

## Features in the plans
- Extend the "focused" property so that you can chain "focused" elements to control the queue for editing;
- Extend the "editType" property and add a new "editableRange" property, which will allow you to define editable elements within a radius relative to the editable section;
- Defining the global property "settings" for customizing sections. Now the implementation is such that we define it for each specific section separately;
- Write proper documentation; xD
- Type the component to diversify the visual display of data (for example, add a pie chart);
- Switch from manual testing to automatic (so far I have paws).
