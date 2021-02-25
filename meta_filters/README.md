# Meta_Filter

Here you find 3 simple example Filters
- only unrated games
- only >3 stars
- only >4 stars

*<update 1.2>*
there is another schript **meta_filter_tableType.js**
This brings 3 other meta filters for table type (SS,EM,ME)
**choose between meta_filter.js and meta_filter_tableType.js**
You can melt both scripts togeter. This is realy simple. just read the code and you will understand.
Just add ```import "meta_filter_tableType.js";``` to your *main.js*
*</update>*

Pinbally standard Filters do not stack. This means if you first select "Only Visual PinballX" as system
and afterwards you select "3 Stars" as Filter --> You get ALL Tables (incl. FX3 and FP) with 3 stars.

MetaFilter narrow the result. If you again first select "Only Visual PinballX" and than select the MetaFilter ">3stars".
You get ONLY Visual PinballX tables with more than 3 stars.

You can easily change the 3 existing filters to the criterias you want or add some additional ones.


![Add meta Filters](https://github.com/worksasdesigned/PinballY_scrips/blob/Master/meta_filters/meta_filter.png)


## Installation ##
1. As usual copy the **meta_filter.js** into your *PinballY/Scripts/* folder
2. Add ```import "meta_filters.js";``` to your **main.js**
3. optional: open **meta_filter.js** and adjust it for your needs
4. restart PinballY



**Version 1.0**
Initially created

**Version 1.2
added a TableType MetaFilter
i guess it might lead to problems having both scripts activated as it would add 2 times the "Metafilter" menu





