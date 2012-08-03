function Rect(x,y,width,height)
{
    this.x = x;
    this.y = y;
    this.width = width;
    this.height= height;
}

Rect.prototype.getX = function()
{
        return this.x;
}

Rect.prototype.getY = function()
{
        return this.y;
}

Rect.prototype.getWidth = function()
{
        return this.width;
}

Rect.prototype.getHeight = function()
{
        return this.height;
}

Rect.prototype.getLeft = function()
{
        return this.x;
}

Rect.prototype.getTop = function()
{
        return this.y;
}

Rect.prototype.getRight = function()
{
        return (this.x + this.width);
}

Rect.prototype.getBottom = function()
{
        return (this.y + this.height);
}
