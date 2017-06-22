# Upgrade

## From 2.7.0 to 3.0.0

Version `3.0.0` removed the need of the `.COMPONENTS` file created in your studio.

You **MUST** do this change:

Adapt the `.cz-config.js` file from your project. Since the `.COMPONENTS` file will not be populated with new components.
You can [check the diff](https://github.com/SUI-Components/SUIStudio/pull/40/files#diff-9c7973411f0d8fa66e3fe0f2dd2c5340) or the [full file](https://github.com/SUI-Components/SUIStudio/blob/ace4b96dce5cc853c6e2f2f43259bfc41697d048/bin/suistudio-init.js#L114) of how your `.cz-config.js` should look like.

You **CAN** do this change:

`.COMPONENTS` file can be safely removed from your repo.