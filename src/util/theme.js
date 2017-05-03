/**
 * @flow
 */

const size = {
  horizontalPadding: 24,
  verticalPadding: 16,
};

const color = {
  tint: '#2b90d9',
  bg: '#282c37',
  darkText: '#484848',
  lightGray: '#f7f7f7',
  gray: '#95989A',
};

const font = {
  title: {
    color: color.darkText,
    fontSize: 32,
    lineHeight: 36,
    fontWeight: 'bold',
  },
  large: {
    color: color.darkText,
    fontSize: 19,
    lineHeight: 24,
  },
  small: {
    color: color.darkText,
    fontSize: 15,
    lineHeight: 18,
  },
};

module.exports = {
  size,
  font,
  color,
  aspectRatio: 1 / 1.6,
};