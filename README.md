# ImportsSorter README

## Features

It sorts the imports on the basis of import's source path.

For example:
```
import * as React from "react";  
import * as Constants from "Constants";
```
above imports would be sorted to:
```
import * as Constants from "Constants";  
import * as React from "react";
```

> Tip: Only works with imports starting with the keyword import and all the import statements must be grouped together