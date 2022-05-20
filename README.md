# The Artists Registration process for sculpturebermagui.org.au

Cloned from catalogue.sculpturebermagui.org.au

App Structure -
https://svelte.dev/repl/7b05d57dcdc04f49be72844e4b2825b3?version=3.44.0

OR (felte multiform)
https://svelte.dev/repl/8eb738732cf74edd86f680c53e6ba253?version=3.44.2

- TODO
  - progess bar with connected circles
  - form steps are all components (not routes)
    - move the files around
    - what hapoens to API routs?
    - do we need to do this in sveltkit or will frontend svelte be enough
    - I think magic link requires a server?
  - array of steps required
  - how do we call each component?
  - how do we pass data down, and back up
  - how do we manage multiple entries
    - the entry component needs to manage ALL entries
    - it must have an "enries all done" button
    - looks similar to now
- Upload

  - store the encoded result
  - make a store that has filename, size, result
  - remember which URL it replaces (if updating)
  - can I just have delete/add - not change

- Backend functions required

  - A URL be CANNOT be used by more than one entry!
  - add image and return URL
  - delete existing URL (by URL)
  - get an image (or just use the URL as "src" on the frontend?)
  - confirm an entry (no more updates allowed?)
  - calculate fee - easy!

- frontend changes

  - magic email?
    - is this part of layout?
    - is this required, OR can we just allow anyone to enter?
  - use local storage for user data
    - why do this we need to get it from the backend?
  - validate all user imput - is "not empty" enough?
    - it is for Google forms!
  - don't allow changes after the confirm step?
  - allow an admin to make changes?
    - oops, now we need roles!
  - enhance "view" page with all data presented.
    - is this outside the step scope?
  - simplify forms by making them more componentised?
    - but don't bike shed!!!

- Things to understand
  - $$restProps
  - <Component {val} let:store> - what is this doing?
  - localstorage - is that a variable in the browser?
